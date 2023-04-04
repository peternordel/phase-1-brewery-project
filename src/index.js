let currentLat;
let currentLon;
//do we need current id declared globally?
let numberToDisplay;
let newBrewFormIsVis = false;
let ipLocation = false;

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

showCurrentLocation(reconcileLocation(defaultLocation));

function reconcileLocation(location) {
    debugger;
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
    currentLat = location.lat
    currentLon = location.lon
    currentLocationData.textContent = `Currently displaying results for: ${location.city}, ${location.state_province} ${location.postal_code}`
    //displayBreweries(currentLat, currentLon)
}

document.querySelector('.custom-location-form').addEventListener('submit', e => {
    e.preventDefault()
    showCurrentLocation(reconcileLocation(fetchFromOSM(e.target['street'].value, e.target['city'].value, e.target['state'].value, e.target['zip'].value)))
    e.target.reset()
})

function fetchFromOSM(street, city, state, zip) {
    fetch(`https://nominatim.openstreetmap.org/search.php?street=${street}&city=${city}&state=${state}&postalcode=${zip}&format=jsonv2&addressdetails=1`)
    .then(resp => resp.json())
    .then(validAddress => validAddress[0])
}

document.getElementById('new-brewery-btn').addEventListener('click', () => {
    newBrewFormIsVis = !newBrewFormIsVis
    document.querySelector('.add-brewery-form').style.visibility = newBrewFormIsVis ? 'visible' : 'hidden'
})

//add new brewery form functionality
document.querySelector('.add-brewery-form').addEventListener('submit', e => {
    e.preventDefault()

    const streetEntered = `${e.target['street1'].value} ${e.target['street2'].value}`
    const newBreweryObject = reconcileLocation(fetchFromOSM(streetEntered, e.target['city'].value, e.target['state'].value, e.target['zip'].value))
    newBreweryObject.name = e.target['name'].value
    newBreweryObject.brewery_type = e.target['type'].value
    newBreweryObject.phone = e.target['phone'].value
    newBreweryObject.website_url = e.target['website_url'].value

    addBreweryToDatabase(newBreweryObject)

    //when we are displaying, we'll need to display the 10 closest, and then check to see if any of the new breweries in our local database are closer, then sort all entries (including the new one) and then delete the last child
})

function addBreweryToDatabase(newBreweryObject) {

    debugger;
        // //post new brewery object to our backend
        // fetch('http://localhost:3000/brewery', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify(newBreweryObject)
        // })
}

function displayBreweries(longitude, latitude, numberToDisplay = 10) {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=${numberToDisplay}`)

    //reconcile versus entered breweries, make an array of the 10 closest based on the above fetch and that database (of entered breweries)
    //BEAU'S CODE
}
