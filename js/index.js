// The index.html file has a form with a search input. When the form is submitted, it should take the value of the input and search GitHub for user matches using the User Search Endpoint.

document.addEventListener('DOMContentLoaded', allowAccess) // since index.js is not deferred, allow access to DOM after DOM is loaded

function allowAccess(){
    const form = document.querySelector('form')
    form.addEventListener('submit', userSearch)
}

function userSearch(e){
    e.preventDefault()

    let currentUserList = document.querySelector('#user-list')
    let reposList = document.querySelector('#repos-list')
    currentUserList.innerHTML = '' // clear existing users from previous search
    reposList.innerHTML = '' // clear existing repos from previous search

    let user = e.target.search.value
    fetch(`https://api.github.com/search/users?q=${user}`)
    .then((resp) => resp.json())
    .then((data) => displayResults(data))
    .catch((e) => console.log('Rejected response: ', e))
}

// Using the results of the search, display information about the users to the page. (You might include showing their username, avatar and a link to their profile.)

function displayResults(data){
    
    data.items.forEach(item => {
        let username = item.login
        let avatarUrl = item.avatar_url
        let profileLink = item.html_url

        let userList = document.querySelector('#user-list')
        let li = document.createElement('li')
        let h3 = document.createElement('h3')
        let p = document.createElement('p')
        let img = document.createElement('img')
        let a = document.createElement('a')

        h3.innerText = 'Username: '
        p.innerText = `Click on the photo to see repos from ${username}`
        a.innerText = `${username}`

        h3.setAttribute('style', 'text-align:center; font-weight:bold')
        p.setAttribute('style', 'text-align:center; font-style:italic')
        img.setAttribute('src', `${avatarUrl}`)
        img.setAttribute('style', 'display:block; margin-left:auto; margin-right:auto; width:50%;')
        img.addEventListener('click', e => showRepo(username, e)) // added the event listener here per lecture
        a.setAttribute('href', `${profileLink}`)

        li.appendChild(h3)
        h3.appendChild(a)
        li.appendChild(p)
        li.appendChild(img)
        userList.appendChild(li)
    })
}

// Clicking on one of these users should send a request to the User Repos Endpoint and return data about all the repositories for that user.

function showRepo(username, e){
    e.preventDefault()
    fetch(`https://api.github.com/users/${username}/repos`)
    .then((resp) => resp.json())
    .then((data) => displayRepo(data))
    .catch((e) => console.log('Rejected response: ', e))
}

// Using the response from the Users Repos Endpoint, display all the repositories for that user on the page.

function displayRepo(data){
    
    let reposList = document.querySelector('#repos-list')
    reposList.innerHTML = '' // clear existing repos from previous search

    let li = document.createElement('li')
    let h3 = document.createElement('h3')

    li.appendChild(h3)
    h3.innerText = 'Repos'

    data.forEach(item => {
        let p = document.createElement('p')
        p.innerText = item.name
        li.appendChild(p)
        })

    reposList.appendChild(li)
}