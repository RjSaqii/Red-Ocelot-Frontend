import {getRepoNames} from './script'
async function populateDropDown() {
    var repoNameData = await getRepoNames()


    var parent = document.body
    let select = document.createElement("select")
    select.id = "multioptions"
    parent.appendChild(select)

    for (let i = 0; i < repoNameData.length; i++) {
        const repoName = repoNameData[i].name;

        console.log(repoName)
        let option = document.createElement('option')
        option.text = repoName
        option.value = repoName
        option.setAttribute("id", "multioptions")

        select.appendChild(option)
    }

}