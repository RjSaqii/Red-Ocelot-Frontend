
const BASE_URL = "http://localhost:8000";


    async function sendGetRequest (endpoint)
    {
        try {
            const response = await fetch ('${BASE_URL}/{endpoint}',{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
    });
            if(!response.ok)
            {
                throw new Error('GET request failed: ${response.status} -  ${response.statusText}');

            }
            return  await response.json();
    } catch (error) {
    console.error('error in the GET request');
    throw error;
    }
}
    


    
    async function getRepoNames()
    {
        const dropdown = document.getElementById('repo-dropdown')
        
        try{
            const data = await fetch('${BASE_URL}/getreponames');
            console.log('Repo Names:', data);
            populateDropdown(data);
            return data;
        }catch(error){ 
            console.error('Error fetching repo names:', error)
             
        }
    }
    function populateDropdown(repoNames)
    {
       
        const dropdown = document.getElementById('repo-dropdown'); // select the elemnt by id
        dropdown.innerHTML = ''; // so no duplicates
        const defaultOption = document.createElement('option'); // select the repo
        defaultOption='';
        dropdown.appendChild(defaultOption);  //adds the option
//populates teh dropdown with the repos
for(let i =0; i < repoNames.lenght;i++)
{
        const repoNames = repoNames[i];
        repoNames.forEach((repoNames))
        const option = document.createElement('option')
        option.value = repoNames;
        option.textContent = repoNames;
        dropdown.appendChild(option);     //adds the option
}
    }
document.addEventListener('DOMContentLoaded',()=> {
    getRepoNames();
}
)
