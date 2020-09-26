"use strict";

let map;
let places; 
let markers = []
let autocomplete;
const countryRestrict = {
    country: "uk",
};

const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");
//List of countries for drop-down 
const countries = {
  au: {
    center: {
      lat: -25.3,
      lng: 133.8,
    },
    zoom: 4,
  },
  br: {
    center: {
      lat: -14.2,
      lng: -51.9,
    },
    zoom: 3,
  },
  ca: {
    center: {
      lat: 62,
      lng: -110.0,
    },
    zoom: 3,
  },
  fr: {
    center: {
      lat: 46.2,
      lng: 2.2,
    },
    zoom: 5,
  },
  de: {
    center: {
      lat: 51.2,
      lng: 10.4,
    },
    zoom: 5,
  },
  mx: {
    center: {
      lat: 23.6,
      lng: -102.5,
    },
    zoom: 4,
  },
  nz: {
    center: {
      lat: -40.9,
      lng: 174.9,
    },
    zoom: 5,
  },
  it: {
    center: {
      lat: 41.9,
      lng: 12.6,
    },
    zoom: 5,
  },
  za: {
    center: {
      lat: -30.6,
      lng: 22.9,
    },
    zoom: 5,
  },
  es: {
    center: {
      lat: 40.5,
      lng: -3.7,
    },
    zoom: 5,
  },
  ind: {
    center: {
      lat: -20.59,
      lng: 78.96,
    },
    zoom: 6,
  },
  pt: {
    center: {
      lat: 39.4,
      lng: -8.2,
    },
    zoom: 6,
  },
  us: {
    center: {
      lat: 37.1,
      lng: -95.7,
    },
    zoom: 3,
  },
  uk: {
    center: {
      lat: 54.8,
      lng: -4.6,
    },
    zoom: 5,
  },
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: countries["uk"].zoom,
    center: countries["uk"].center,
    mapTypeControl: false,
    panControl: true,
    zoomControl: true,
    streetViewControl: false,
  });
    
    //Create the autocomplete object and associate it with the 'cities' search box.
    //Restrict the search to the UK and place type to 'cities'.
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
      types: ["(cities)"],
      componentRestrictions: countryRestrict,
    }
  );
  places = new google.maps.places.PlacesService(map);
//Add an event listener to the country
autocomplete.addListener("place_changed", onPlaceChanged);
//Zoom the map to the chosen city
 document
    .getElementById("country")
    .addEventListener("change", setAutocompleteCountry);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();
      if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();//This is where I need to add my search function for the check boxes
}else{
    document.getElementById("autocomplete").placeholder = "Enter a city";
    }
} 

function search() {
    const search = {
        bounds: map.getBounds(),
        types: ["lodging"],
    };
    places.nearbySearch(search, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            for(let i =0; i < results.length; i++) {
                const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
                const markerIcon = MARKER_PATH + markerLetter + ".png";
                        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        }); 
        markers[i].placeResult = results[i];
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
            }
        }
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}

function setAutocompleteCountry() {
    const country =document.getElementById("country").value;
    if (country == "all") { 
        autocomplete.setComponentRestrictions({
            country: [],
        });
        map.setCenter({
            lat: 15,
            lng: 0,
        });
  map.setZoom(2);
  } else {
    autocomplete.setComponentRestrictions({
      country: country,
    });
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
  }
    clearMarkers();
}

function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");
}

//Itinerary

let myForm = document.getElementById("myForm");
let entry = document.getElementById("entry");
let time = document.getElementById("time")

let actualItinerary = document.getElementById("actualItinerary")

myForm.addEventListener("submit", (e) =>{
  e.preventDefault()
  createEntry(time.value, entry.value)
})

function createEntry(x, z) {
  let ourHTML = `<li class="row"><div class=" inner-div col-4">${x}&nbsp;</div><div class="col-4 inner-div">${z}</div><div class="col-4 inner-div"><button onclick="deleteItem(this)">Delete entry</button></div></li>`
  actualItinerary.insertAdjacentHTML("beforeend", ourHTML)
  entry.value = "";
  time.value = "";
  entry.focus()
}

function deleteItem(object) {
  object.parentElement.remove();
}
