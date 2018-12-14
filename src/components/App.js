import React, { Component } from 'react';
import LocationList from './LocationList';
import '../css/App.css';

class App extends Component {
  /**
     * Constructor
     */
  constructor(props) {
    super(props);
    this.state = {
      'map': '',
      'prevmarker': '',
      'infowindow': '',
      'locations': [
        {
          'name': "Toit Brewpub",
          'type': "Brewery",
          'latitude': 12.979249,
          'longitude': 77.6383542
        },
        {
          'name': "Brahmins Coffee Bar",
          'type': "Breakfast",
          'latitude': 12.9539208,
          'longitude': 77.5688741
        },
        {
          'name': "Hari Super Sandwich",
          'type': "Sandwiches",
          'latitude': 12.9328532,
          'longitude': 77.5803597
        },
        {
          'name': "UB City",
          'type': "Mall",
          'latitude': 12.9716313,
          'longitude': 77.593623
        },
        {
          'name': "Cubbon Park",
          'type': "Park",
          'latitude': 12.9763472,
          'longitude': 77.5907397
        },
        {
          'name': "St. Andrew's Church",
          'type': "Church",
          'latitude': 12.979331,
          'longitude': 77.6019493
        },
        {
          'name': "Show off",
          'type': "Mall",
          'latitude': 12.9327549,
          'longitude': 77.5788523
        },
        {
          'name': "Orion Mall",
          'type': "Mall",
          'latitude': 13.0107901,
          'longitude': 77.5526975
        },
        {
          'name': "Taj Vivanta",
          'type': "Hotel",
          'latitude': 12.9733649,
          'longitude': 77.6173734
        },
        {
          'name': "Corner House",
          'type': "Shop",
          'latitude': 12.9328514,
          'longitude': 77.5650387
        }
      ]
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    // Google Maps can invoke it now onwards
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script
    loadMapScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCHVLG3-8n-mhmyIQj5vomehsPMLm7qSTQ&libraries=places&callback=initMap')
  }

  /**
   * Initialise the map once the script is loaded
   */
  initMap() {
    const self = this;

    // Get the map container element
    const mapEl = document.getElementById('map');

    // setting the map container height
    mapEl.style.height = window.innerHeight + "px";

    // Instatiating google map instance and initializing it
    const map = new window.google.maps.Map(mapEl, {
      center: { lat: 12.972442, lng: 77.580643 },
      zoom: 13,
      mapTypeControl: false
    });

    // Instatiating info window
    const InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
      self.closeInfoWindow();
    });

    this.setState({
      'map': map,
      'infowindow': InfoWindow
    });

    // setting the center when the map is resized in the browser
    window.google.maps.event.addDomListener(window, "resize", function () {
      const center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, 'click', function () {
      self.closeInfoWindow();
    });

    const locations = [];

    // Creating marker for locations
    this.state.locations.forEach(function (location) {
      const longname = `${location.name} (${location.type})`;
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.latitude, location.longitude),
        map: map,
        animation: window.google.maps.Animation.DROP
      });

      marker.addListener('click', function () {
        self.openInfoWindow(marker);
      });

      location.marker = marker;
      location.longname = longname;
      location.display = true;
      locations.push(location);
    });

    this.setState({
      'locations': locations
    });

  }

  /**
   * Open the infowindow for the marker
   */
  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      'prevmarker': marker
    });
    this.state.infowindow.setContent('Loading...');
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);
  }

  /**
   * Retrive the location data from the foursquare api for the marker and display it in the infowindow
   * @param {object} location marker
   */
  getMarkerInfo(marker) {
    const self = this;
    const clientId = "ROPR1B2BCQYNGEU125RCL0MITYHSZI4JS2HKNKHGLKCIPQMY";
    const clientSecret = "APHUPOZLMNHOXQSRXSLM1Q43YWMJNFKNJFTHQ5O33A0DO3TY";
    const url = "https://api.foursquare.com/v2/venues/search?client_id="
      + clientId + "&client_secret="
      + clientSecret + "&v=20130815&ll="
      + marker.getPosition().lat() + ","
      + marker.getPosition().lng() + "&limit=1";
    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            self.state.infowindow.setContent("Sorry. Data couldn't be loaded");
            return;
          }

          // The data will be displayed in the info window
          response.json().then(function (data) {
            const venue = data.response.venues[0];
            const address = '<b>Address: </b>' + (venue.location.formattedAddress.join(', ')) + '<br>';
            const verified = '<b>Verified Location: </b>' + (venue.verified ? 'Yes' : 'No') + '<br>';
            const readMore = '<a href="https://foursquare.com/v/' + venue.id
              + '" target="_blank">Read More on Foursquare</a>'
            self.state.infowindow.setContent(address + verified + readMore);
          });
        }
      )
      .catch(function (err) {
        self.state.infowindow.setContent("Sorry. Data couldn't be loaded");
      });
  }

  /**
   * Close the infowindow for the marker
   */
  closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({
      'prevmarker': ''
    });
    this.state.infowindow.close();
  }

  /**
   * Renders component to the dom
   */
  render() {
    return (
      <main className="App">
        <LocationList key="100" locations={this.state.locations} openInfoWindow={this.openInfoWindow}
          closeInfoWindow={this.closeInfoWindow} />
        <div id="map"></div>
      </main>
    );
  }
}

export default App;

/**
 * Load the google maps Asynchronously
 * from the google maps script
 */
function loadMapScript(src) {
  const ref = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.async = true;
  script.onerror = function () {
    document.write("Google Maps can't be loaded");
  };
  script.src = src;
  ref.parentNode.insertBefore(script, ref);
}