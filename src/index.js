const breweryCollection = document.getElementById('brewery-collection')

const defaultLocation = {
    lat: 39.756454149999996,
    lon: -104.99103327448341,
    address: {
        city: 'Denver',
        house_number: 2228,
        street: 'Blake Street',
        postcode: 80205,
        state: 'Colorado'
    }
}

let currentId;
let currentLatitude;
let currentLongitude;
let numberToDisplay = 10;
let newBrewFormIsVis = false;
let ipLocation = false;
let allComments;
let allLikes;

fetch(`http://localhost:3000/comments/`)
.then(resp => resp.json())
.then(data => {
    allComments = data;
    fetchLikes();
})

function fetchLikes() {
    fetch(`http://localhost:3000/likes/`)
    .then(resp => resp.json())
    .then(data => {
        allLikes = data[0];
        showCurrentLocation(reconcileLocation(defaultLocation));
    })
}

function fetchData() {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${currentLatitude},${currentLongitude}&per_page=${numberToDisplay}`)
    .then(resp => resp.json())
    .then(data => {
        breweryCollection.replaceChildren()
        data.forEach(brewery => createCard(brewery))
        fetch('http://localhost:3000/likes/0', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(allLikes)
        })
    })
}

function createCard(brewery) {
    const card = document.createElement("div");
    card.classList.add("card");
    currentId = brewery.id;

    const nameElement = document.createElement("h2");
    nameElement.textContent = brewery.name;
    const phoneTooltip = document.createElement('p')
    phoneTooltip.textContent = brewery.phone
    phoneTooltip.className = 'tooltip'

    nameElement.addEventListener('mouseover', () => {
        phoneTooltip.style.visibility = 'visible';
    })
    nameElement.addEventListener('mouseout', () => {
        phoneTooltip.style.visibility = 'hidden';
    })

    const addressElement = document.createElement("p");
    addressElement.textContent = `${brewery.address_1}, ${brewery.city}, ${brewery.state_province} ${brewery.postal_code}`;

    const typeElement = document.createElement("p");
    typeElement.textContent = `Type: ${brewery.brewery_type}`;

    const websiteElement = document.createElement("a");
    const websitePara = document.createElement('p');
    websiteElement.href = brewery.website_url;
    websiteElement.textContent = brewery.website_url;
    websitePara.append(websiteElement);

    const phoneElement = document.createElement("p");
    phoneElement.textContent = `Phone: ${brewery.phone}`;

    const likesElement = document.createElement("p");
    if(!(`${brewery.id}` in allLikes)) {
        allLikes[brewery.id] = 0
    }
    likesElement.textContent = `${allLikes[brewery.id]} likes     `

    const likeBtn = document.createElement("button");
    likeBtn.id = `like-btn-${currentId}`;
    likeBtn.textContent = "Like";
    likeBtn.addEventListener('click', e => {
        e.stopPropagation()
        e.preventDefault()
        allLikes[brewery.id]++

        fetch('http://localhost:3000/likes/0', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(allLikes)
        })
        .then(likesElement.textContent = `${allLikes[brewery.id]} likes`)
    })

    const commentSection = document.createElement("div");
    commentSection.className = "comment-section";
    const commentList = document.createElement('ul');
    commentList.id = `comment-list-${currentId}`

    const commentForm = document.createElement("form");
    const commentInput = document.createElement('input');
    const commentSubmit = document.createElement('button');
    commentForm.className = "comment-form";
    commentForm.id = currentId;
    commentInput.type = 'text'
    commentInput.name = 'comment';
    commentInput.placeholder = 'Add a comment...';
    commentSubmit.textContent = "Comment";
    commentSubmit.type = 'submit';
    commentForm.append(commentInput, commentSubmit)
    commentForm.addEventListener('submit', e => handleNewComment(e))
    commentSection.append(commentList, commentForm);

    card.append(nameElement, phoneTooltip, addressElement, typeElement, websiteElement, phoneElement, likesElement, likeBtn, commentSection);
    breweryCollection.appendChild(card);

    for(const comment of allComments) {
        if(comment.breweryId === brewery.id) {
            renderComment(comment)
        }
    }
}

function renderComment(comment) {
    const commentList = document.getElementById(`comment-list-${comment.breweryId}`);
    const singleComment = document.createElement("li");
    singleComment.textContent = comment.content;
    commentList.appendChild(singleComment)
}

function handleNewComment(e) {
    e.preventDefault()
    e.stopPropagation()
    newCommentObj = {
        breweryId: e.target.id,
        content: e.target['comment'].value
    }

    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newCommentObj)
    })
    .then(renderComment(newCommentObj))
}

function reconcileLocation(location) {
    //reconfigure object received from default IP address for use in this program
    if(ipLocation) {
        location.lat = location.latitude
        location.lon = location.longitude
        location.postal_code = location.postal
        location.address_1 = location.street
        location.state_province = location.region
    }
    //reconfigure object received from nominatim.openstreetmap.org for use in this program
    else {
        location.address_1 = location.address.road
        if(location.address.town) {
            location.city = location.address.town
        } else {
            location.city = location.address.city
        }
        location.state_province = location.address.state
        location.postal_code = location.address.postcode
        location.latitude = location.lat
        location.longitude = location.lon
    }
    return location
}

function showCurrentLocation(location) {
    const currentLocationData = document.getElementById('current-location-data')
    currentLatitude = location.lat
    currentLongitude = location.lon
    debugger;
    currentLocationData.textContent = `Currently displaying results for: ${location.city}, ${location.state_province} ${location.postal_code}`
    fetchData(currentLatitude, currentLongitude)
}

document.querySelector('.custom-location-form').addEventListener('submit', e => {
    e.preventDefault()
    fetchFromOSM(e.target['street'].value, e.target['city'].value, e.target['state'].value, e.target['zip'].value)
    e.target.reset()
})

function fetchFromOSM(street, city, state, zip) {
    fetch(`https://nominatim.openstreetmap.org/search.php?street=${street}&city=${city}&state=${state}&postalcode=${zip}&format=jsonv2&addressdetails=1`)
    .then(resp => resp.json())
    .then(validAddress => showCurrentLocation(reconcileLocation(validAddress[0])))
}

/*
commentBtn.addEventListener("click", () => {
    const commentBtn = commentInput.value;
    
        if (comment) {
            // add comment to the API
            fetch(`http://localhost:3000/brewery/${brewery.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment: comment
                })
            })
                .then(resp => resp.json())
                .then(data => {
                }
                )
            }
        }
    )

/*
    //add event listeners for like button and comment button
    likeBtn.addEventListener("click", () => {
        const likeBtn = like
    
    // update like count 
    fetch(`http://localhost:3000/brewery/${brewery.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            likes: brewery.likes + 1
        })
    })
        .then(resp => resp.json())
        .then(data => {
            // update like count in the DOM
            likes.textContent = `${data.likes} Likes`;
            // update the brewery object with the new data
            brewery.likes = data.likes;
        })

});



            create an img element for the brewery image
            const image = document.createElement("img");
            image.src = brewery.image;
            card.appendChild(image);


  let isVis = false;
  document.querySelector('.tooltip').addEventListener('mouseover', handleMouseover)
  function handleMouseover() {
  document.querySelector('.tooltiptext').style.visibility = isVis ? 'hidden' : 'visible'
  }
  if(isVis) {
  document.querySelector('.tooltiptext').style.visibility = 'hidden'
  }
  else {
  document.querySelector('.tooltiptext').style.visibility = 'visible'     
  }
  isVis = !isVis;
*/



/* document.getElementById('new-brewery-btn').addEventListener('click', () => {
    //     newBrewFormIsVis = !newBrewFormIsVis
    //     document.querySelector('.add-brewery-form').style.visibility = newBrewFormIsVis ? 'visible' : 'hidden'
    // })
    
    // //add new brewery form functionality
    // document.querySelector('.add-brewery-form').addEventListener('submit', e => {
    //     e.preventDefault()
    
    //     const streetEntered = `${e.target['street1'].value} ${e.target['street2'].value}`
    //     const newBreweryObject = reconcileLocation(fetchFromOSM(streetEntered, e.target['city'].value, e.target['state'].value, e.target['zip'].value))
    //     newBreweryObject.name = e.target['name'].value
    //     newBreweryObject.brewery_type = e.target['type'].value
    //     newBreweryObject.phone = e.target['phone'].value
    //     newBreweryObject.website_url = e.target['website_url'].value
    
    //     addBreweryToDatabase(newBreweryObject)
    
    //     //when we are displaying, we'll need to display the 10 closest, and then check to see if any of the new breweries in our local database are closer, then sort all entries (including the new one) and then delete the last child
    // })
    
    // function addBreweryToDatabase(newBreweryObject) {
    
    //     debugger;
    //         // //post new brewery object to our backend
    //         // fetch('http://localhost:3000/brewery', {
    //         //     method: 'POST',
    //         //     headers: {
    //         //         'Content-Type': 'application/json',
    //         //         'Accept': 'application/json'
    //         //     },
    //         //     body: JSON.stringify(newBreweryObject)
    //         // })
    // }
    */
   