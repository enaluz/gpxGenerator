import React, { Component } from 'react'

export default class Generator extends Component {
  constructor() {
    super()
    this.state = {
      lon: '',
      lat: '',
      rad: '',
    }
  }

  // Takes gpx file text as argument and turns it into a downloadable file
  downloadHelper = (text) => {
    let element = document.createElement('a'); // Generate an anchor tag
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); // Make href = generated gpx file
    element.setAttribute('download', 'triggerRule.txt'); // Make user download the generated gpx file
    element.style.display = 'none'; // Ensure anchor tag doesn't actually show up on the screen
    document.body.appendChild(element); // Add the anchor tag to the page itself
    element.click(); // Click the anchor tag for the user to initiate download
  }

  // Takes user's form input and generates text for the gpx file
  gpxGenerator = () => {
    // midLon, midLat === state inside the geofence
    let midLat = this.state.lat; //-111.93399557934572; // input by user
    let midLon = this.state.lon; //33.41674742124614; // input by user
    let rad = this.state.rad; //1610.8461522696207; // input by user

    // TODO: Use Haversine Formula to calculate exit coordinates
    // startLat and startLon is state before entering geofence
    let startLat = (rad * 1.10) - midLat;
    let startLon = (rad * 1.10) - midLon;

    // TODO: Use Haversine Formula to calculate exit coordinates
    // endLat and endLon is state after exiting geofence
    let endLat = (rad * 1.10) + midLat;
    let endLon = (rad * 1.10) + midLon;

    // TODO (maybe): Dynamically calculate times to simulate realistic movement
    let startTime = "2014-09-24T14:55:37Z";
    let midTime = "2014-09-24T14:55:42Z"; // 5 seconds after startTime
    let endTime = "2014-09-24T14:55:47Z"; // 5 seconds after midTime
    let text =
      // Excuse the poor indentation, it's necessary lol
      `<!-- Generated using SpotSense GPX Tools -->
<?xml version="1.0"?>
<gpx version="1.1" creator="Xcode">
  <!-- Lon was set to ${midLon} -->
  <!-- Lat was set to ${midLat} -->
  <!-- Radius was set to ${rad} -->

  <!-- Entering Geofence -->
  <wpt lat="${startLat}" lon="${startLon}">
    <time>${startTime}</time>
  </wpt>

  <!-- Inside Geofence -->
  <wpt lat="${midLat}" lon="${midLon}">
    <time>${midTime}</time>
  </wpt>

  <!-- Exiting Geofence -->
  <wpt lat="${endLat}" lon="${endLon}">
    <time>${endTime}</time>
  </wpt>
</gpx>`
    this.downloadHelper(text);
  }

  // Updates state as inputs in form changes
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  // Helper function calculates distance between two locations
  calcDistance = (loc1, loc2) => { // locations should have "lat" and "lon" keys
    let R = 6371; // Earth's radius in km
    // convert from string to a number
    let lat1 = parseInt(loc1.lat, 10);
    let lon1 = parseInt(loc1.lon, 10);
    let lat2 = parseInt(loc2.lat, 10);
    let lon2 = parseInt(loc2.lon, 10);

    // get the difference in lat and lon in radians
    let dLat = this.toRad(lat2 - lat1);
    let dLon = this.toRad(lon2 - lon1);

    // convert to radians
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);

    // now calculate!
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) *
      Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

  // Helper function converts numeric degrees to radians
  toRad = (Value) => {
    return Value * Math.PI / 180;
  }

  render() {
    return (
      <div>
        <form id="triggerRule" className="mb-5" onSubmit={this.gpxGenerator}>
          <h4>Latitude</h4>
          <input
            required
            min="-90"
            max="90"
            className="mb-4"
            style={{ width: "5rem" }}
            type="number"
            name="lat"
            value={this.state.lat}
            onChange={this.handleInputChange} />

          <h4>Longitude</h4>
          <input
            required
            min="-180"
            max="180"
            className="mb-4"
            style={{ width: "5rem" }}
            type="number"
            name="lon"
            value={this.state.lon}
            onChange={this.handleInputChange} />

          <h4>Radius</h4>
          <input
            required
            min="1" // 1/3 of a meter is 1 foot, a reasonable size for a radius(?)
            className="mb-4"
            style={{ width: "5rem" }}
            type="number"
            name="rad"
            value={this.state.rad}
            onChange={this.handleInputChange} /><br></br>
          <input className="btn btn-primary mt-4" type="submit" name="submit" value="Download" />
          {/* <p onClick={() => this.validateLatLon(181,181,3)}>Tester</p> */}
        </form>
      </div>
    )
  }
}
