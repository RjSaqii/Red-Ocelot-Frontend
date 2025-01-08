const API_URL = 'http://localhost:8000';
//use these to connect
async function sendGetRequest(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error(`GET request failed: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error in GET request:', error);
        throw error;
    }
}

async function sendPostRequest(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`POST request failed: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
}
//Implemented methods below

//getters
async function getRepoNames() {
    try {
        return await sendGetRequest('getreponames');
    } catch (error) {
        console.error('Error fetching repo names:', error);
    }
}


//Posts
async function getAuthors(repoName) {
    data = await sendPostRequest("authorsbyreponame",{reponame:repoName})
    return data
}

// function to get plots from backend, plots will be used to generate pie chart using plotly
async function getPlots(repoName) {
    try {
        return await sendPostRequest("piechart", { reponame: repoName });
    } catch (error) {
        console.error(`Error fetching plot data for repository ${repoName}:`, error);
        throw error;
    }
}
// function to get plots from backend, plots will be used to generate pie chart using plotly
async function getHistogram(repoName,start_date,end_date,max_no_of_commits) {
    const data = await sendPostRequest("histogram",{reponame:repoName,start_date, end_date, max_no_of_commits});
    return data
}

async function getbubblechart() {
    const data = await sendGetRequest("bubblechart");
    return data
    
}
async function getBarPlots(repoName, no_of_lines) {
    try {
        const data = await sendPostRequest("barchart", { reponame: repoName, no_of_lines });
        console.log("Bar Plot Data:", data); 
        return data;
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        throw error;
    }
}

async function getauthorbarchart(reponame,username) {
    const data = await sendPostRequest("filelinecountbyrepo",{reponame: reponame,username: username});
    return data
}

async function getauthorbubblechart(username) {
    const data = await sendPostRequest("authorbubblechartdata",{username: username});
    return data
}

async function getauthorHistogram(start_date,end_date,username, reponame) {
    const data = await sendPostRequest("commithistogram",{start_date, end_date, username, reponame});
    return data
}

function createChart(plotData, targetElementId, chartType) {
    try {
        console.log("Chart Data Received:", plotData); 
        if (typeof plotData !== 'object') plotData = JSON.parse(plotData);

        const data = plotData.data.map((trace) => ({
            ...trace,
            type: chartType,
        }));

        console.log("Formatted Chart Data:", data); 

        const layout = {
            ...plotData.layout,
            title: {
                
                font: { size: 18, color: '#e5e5e5' },
                x: 0.5, 
            },
            paper_bgcolor: '#222222',
            plot_bgcolor: '#111111',
            font: { color: '#e5e5e5' },
            margin: { l: 50, r: 50, t: 50, b: 50 }, 
            legend: {
                orientation: 'h', 
                x: 0.5,
                xanchor: 'center',
                y: -0.2, 
            },
            height: 400, 
            width: 700, 
        };

        // Clear the container before rendering a new chart
        Plotly.purge(targetElementId);

        // Render the chart
        Plotly.newPlot(targetElementId, data, layout);
    } catch (error) {
        console.error("Error creating chart:", error);
    }
}

// Function to Show Bar Chart Section
function showBarChartSection() {
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('button-container').classList.add('hidden');
    document.getElementById('barChartSection').classList.remove('hidden');
    renderBarChart();
}
    document.getElementById('barChartBtn').addEventListener('click', showBarChartSection);

// Function to Show Pie Chart Section
function showPieChartSection() {
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('button-container').classList.add('hidden');
    document.getElementById('pieChartSection').classList.remove('hidden');
    renderPieChart();
}

// Add event listener for Pie Chart button
document.getElementById('pieChartBtn').addEventListener('click', showPieChartSection);

// Function to Render Pie Chart
async function renderPieChart(repoName, targetElementId = "currentRepoChart") {
    try {
        const plotData = await getPlots(repoName);
        createChart(plotData, targetElementId, "pie");
    } catch (error) {
        console.error("Error rendering pie chart:", error);
    }
}


// Add Event Listener for DOM Content Loaded
document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('pieChartBtn').addEventListener('click', showPieChartSection);
});

// Function to render the histogram
async function renderHistogram(repoName, targetElementId = "mainHistogram") {
    const startDate = document.getElementById("startDate")?.value || "2019-01-01";
    const endDate = document.getElementById("endDate")?.value || "2025-01-01";
    const maxCommits = document.getElementById("max-commits")?.value || 100;

    try {
        const plotData = await getHistogram(repoName, startDate, endDate, maxCommits);
        createChart(plotData, targetElementId, "histogram");
    } catch (error) {
        console.error(`Error rendering histogram for ${repoName}:`, error);
    }
}

async function fetchAuthorHistogramData(username, reponame, startDate, endDate) {
    console.log("Fetching histogram data for author:", username, reponame, startDate, endDate);
    try {
        const response = await sendPostRequest('commithistogram', {
            username: username,
            reponame: reponame,
            start_date: startDate,
            end_date: endDate,
        });

        renderAuthorHistogram(response); 
        return response; 
    } catch (error) {
        console.error("Error fetching histogram data:", error);
        throw error;
    }
}


// Function to render the histogram
function renderAuthorHistogram(rawData) {
    try {
        // Parse the JSON string into a JavaScript object
        const parsedData = JSON.parse(rawData);

        // Check for required keys
        if (!parsedData.data || !parsedData.layout) {
            console.error("Invalid data format from backend:", parsedData);
            alert("Failed to render histogram due to invalid data format.");
            return;
        }

        const targetElementId = "currentRepoChart";

        // Render the chart using Plotly
        Plotly.newPlot(targetElementId, parsedData.data, parsedData.layout);
    } catch (error) {
        console.error("Error parsing backend response:", error);
        alert("An error occurred while processing the histogram data.");
    }
}



// Function to go back to the main page
function goToMainPage() {
    // Hide the chart section
    document.getElementById('pieChartSection').classList.add('hidden');

    // Show the main content and button container
    document.querySelector('.main-content').classList.remove('hidden');
    document.getElementById('button-container').classList.remove('hidden');
}

// Add event listener to the Back button
document.getElementById('backButton').addEventListener('click', goToMainPage);

// ------------------------ GitHub Integration stuff --------------------------

document.addEventListener("DOMContentLoaded", () => {
    const compareHeader = document.getElementById("toggleCompare");
    const comparisonDiv = document.getElementById("comparisonDiv");

    // Ensure the div is hidden on page load
    comparisonDiv.classList.add("hidden");

    // Toggle the visibility of the comparisonDiv
    compareHeader.addEventListener("click", () => {
        if (comparisonDiv.classList.contains("hidden")) {
            comparisonDiv.classList.remove("hidden");
        } else {
            comparisonDiv.classList.add("hidden");
        }
    });
});

async function getGithubAuthorPieChart(repoName,username) {
    try {
        const response = await fetch(`${API_URL}/githubauthorpiechart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reponame: repoName, username: username }),
        });
        if (!response.ok) throw new Error(`GET pie chart failed: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching author pie chart:', error);
        throw error;
    }
}

// Fetch repositories for a specific author
async function getAuthorRepositories(author) {
    try {
        const response = await sendGetRequest('getreponamesbyuser/' + author);
        return response; // Expected to return a list of repository names
    } catch (error) {
        console.error("Error fetching repositories for author:", error);
    }
}

// Populate the dropdown with repository names
async function populateRepoDropdown(repoNames) {
    const dropdown = document.getElementById("repoDropdown");
    dropdown.innerHTML = ""; 

    repoNames.forEach(repo => {
        const option = document.createElement("option");
        option.textContent = repo;
        option.value = repo;
        dropdown.appendChild(option);
    });
}

// Render the pie chart based on the selected repository
async function renderRepoPieChart(repoName) {
    try {
        const plotData = await getGithubAuthorPieChart(repoName); 
        createChart(plotData, "authorPieChart", "pie"); 
    } catch (error) {
        console.error("Error rendering pie chart:", error);
    }
}
// Event listener for fetching repositories based on author input
document.getElementById("loadReposButton").addEventListener("click", async () => {
    const author = document.getElementById("authorInput").value;
    if (!author) {
        alert("Please enter an author name.");
        return;
    }

    try {
        const repoNames = await getAuthorRepositories(author);
        if (repoNames && repoNames.length > 0) {
            await populateRepoDropdown(repoNames); 
            // Render the first repo by default
            await renderRepoPieChart(repoNames[0]);
        } else {
            alert("No repositories found for this author.");
        }
    } catch (error) {
        console.error("Error loading repositories:", error);
    }
});

// Event listener for dropdown changes to render pie chart for the selected repo
document.getElementById("repoDropdown").addEventListener("change", async (event) => {
    const selectedRepo = event.target.value;
    if (selectedRepo) {
        await renderRepoPieChart(selectedRepo);
    }
});