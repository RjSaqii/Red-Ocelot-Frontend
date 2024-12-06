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

