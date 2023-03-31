//this will pull sample data so we can build brewery cards running local server

fetch('http://localhost:3000/brewery')
.then(resp => resp.json())
.then(data => console.log(data))