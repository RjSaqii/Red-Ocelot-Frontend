const API_URL = 'http://localhost:8000';
//use these to connect
async function sendGetRequest(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
        throw new Error(`GET request failed: ${response.status} -
        ${response.statusText}`);
    }
    return await response.json();
    
    } 
    catch (error) {
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
        if (!response.ok) {
            throw new Error(`POST request failed: ${response.status} 
${response.statusText}`);
        }
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
        const data = await sendGetRequest('getreponames');
        return data;
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
    const data = await sendPostRequest("piechart",{reponame:repoName});
    return data
}

//Function to create pie chart using plotly data
function createPieChart(plotData, targetElementId) {
    plotData = JSON.parse(plotData)
    // Parse the data and layout from the plotData
    const data = plotData.data; // Extract the data array
    const layout = plotData.layout; // Extract the layout object

    console.log(data)
    console.log(layout)

    console.log(typeof plotData)

    // Ensure 'type' is explicitly set to 'pie'
    data.forEach(trace => {trace.type = "pie"});

    // Use Plotly to render the pie chart in the specified HTML element
    Plotly.newPlot(targetElementId, data, layout);
}

