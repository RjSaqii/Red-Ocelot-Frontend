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
async function getHistogram(repoName,start_date,end_date) {
    const data = await sendPostRequest("histogram",{reponame:repoName,start_date, end_date});
    return data
}

async function getBarPlots(repoName) {
    const data = await sendPostRequest("barchart",{reponame:repoName});
    return data
}
async function getbubblechart() {
    const data = await sendGetRequest("bubblechart");
    return data
    
}

function createChart(plotData, targetElementId, chartType) {
    try {
        if (typeof plotData !== 'object') plotData = JSON.parse(plotData);

        const data = plotData.data.map((trace) => ({
            ...trace,
            type: chartType,
        }));

        const layout = {
            ...plotData.layout,
            title: {
                text: 'Author Commit Distribution',
                font: { size: 18, color: '#e5e5e5' },
                x: 0.5, // Center the title
            },
            paper_bgcolor: '#222222',
            plot_bgcolor: '#111111',
            font: { color: '#e5e5e5' },
            margin: { l: 50, r: 50, t: 50, b: 50 }, // Add padding around the chart
            legend: {
                orientation: 'h', // Horizontal legend
                x: 0.5,
                xanchor: 'center',
                y: -0.2, // Position below the chart
            },
            height: 400, // Fixed chart height
            width: 700, // Fixed chart width
        };

        // Clear the container before rendering a new chart
        Plotly.purge(targetElementId);

        // Render the chart
        Plotly.newPlot(targetElementId, data, layout);
    } catch (error) {
        console.error('Error creating chart:', error);
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
async function renderPieChart() {
    const currentRepoName = document.getElementById('multioptions').value;
    try {
        const plotData = await getPlots(currentRepoName);
        createChart(plotData, "pieChart", "pie");
    } catch (error) {
        console.error("Error rendering pie chart:", error);
    }
}

// Add Event Listener for DOM Content Loaded
document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('pieChartBtn').addEventListener('click', showPieChartSection);
});

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
