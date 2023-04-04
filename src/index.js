const breweryCollection = document.getElementById("brewery-collection");


const latitude = 39.7427
const longitude = -104.8129
const numberToDisplay = 10

fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=${numberToDisplay}`)

    .then(resp => resp.json())
    .then(data => {

        data.forEach(brewery => {
            createCard(brewery);
        });

        function createCard(brewery) {
            const card = document.createElement("div");
            card.classList.add("card");
            breweryCollection.appendChild(card);
            addBreweryName(card, brewery.name);
            addBreweryAddress(card, brewery.address_1, brewery.city, brewery.state_province, brewery.postal_code);
            addBreweryType(card, brewery.brewery_type);
            addBreweryWebsite(card, brewery.website_url);
            addBreweryPhone(card, brewery.phone);
            addBreweryLikes(card, brewery.likes);
            addLikeButton(card);
            addCommentSection(card);
        }

        function addBreweryName(card, name) {
            const nameElement = document.createElement("h2");
            nameElement.textContent = name;
            card.appendChild(nameElement);
        }

        function addBreweryAddress(card, address_1, city, state_province, postal_code) {
            const addressElement = document.createElement("p");
            addressElement.textContent = `${address_1}, ${city}, ${state_province} ${postal_code}`;
            card.appendChild(addressElement);
        }

        function addBreweryType(card, type) {
            const typeElement = document.createElement("p");
            typeElement.textContent = `Type: ${type}`;
            card.appendChild(typeElement);
        }

        function addBreweryWebsite(card, website_url) {
            const websiteElement = document.createElement("p");
            websiteElement.innerHTML = `<a href="${website_url}" target="_blank">${website_url}</a>`;
            card.appendChild(websiteElement);
        }

        function addBreweryPhone(card, phone) {
            const phoneElement = document.createElement("p");
            phoneElement.textContent = `Phone: ${phone}`;
            card.appendChild(phoneElement);
        }

        function addBreweryLikes(card, likes) {
            const likesElement = document.createElement("p");
            likesElement.textContent = `${likes} Likes`;
            card.appendChild(likesElement);
        }

        function addLikeButton(card) {
            const likeBtn = document.createElement("button");
            likeBtn.textContent = "Like";
            likeBtn.className = "like-btn";
            card.appendChild(likeBtn);
        }

        function addCommentSection(card) {
            const commentSection = document.createElement("div");
            commentSection.className = "comment-section";
            card.appendChild(commentSection);
            addCommentInput(commentSection);
            addCommentButton(commentSection);
            addComments(commentSection);
        }

        function addCommentInput(commentSection) {
            const commentInput = document.createElement("input");
            commentInput.type = "text";
            commentInput.placeholder = "Add a comment...";
            commentInput.className = "comment-input";
            commentSection.appendChild(commentInput);
        }

        function addCommentButton(commentSection) {
            const commentBtn = document.createElement("button");
            commentBtn.textContent = "Comment";
            commentBtn.className = "comment-btn";
            commentSection.appendChild(commentBtn);
        }

        function addComments(commentSection) {
            const comments = document.createElement("div");
            comments.className = "comments";
            commentSection.appendChild(comments);
        }
    })

   /* commentBtn.addEventListener("click", () => {
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



             // create an img element for the brewery image
            // const image = document.createElement("img");
            // image.src = brewery.image;
            // card.appendChild(image);


//  let isVis = false;
//  document.querySelector('.tooltip').addEventListener('mouseover', handleMouseover)
//  function handleMouseover() {
//  document.querySelector('.tooltiptext').style.visibility = isVis ? 'hidden' : 'visible'
//  }
//  if(isVis) {
//  document.querySelector('.tooltiptext').style.visibility = 'hidden'
//  }
//  else {
//  document.querySelector('.tooltiptext').style.visibility = 'visible'     
//  }
//  isVis = !isVis;
*/
