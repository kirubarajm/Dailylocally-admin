import Map from '../components/Map'
import React from 'react';
var marker;
var editMap, clocation;
var ZoneArea=[];
var vMap;
var isZoneMap;
export class MapContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { latitude: this.props.lat || 0, longitude: this.props.lng || 0 }
    isZoneMap=this;
    this.state = { latitude: this.props.lat || 0, longitude: this.props.lng || 0,isPolygonViewed:false }
  }
  componentWillMount() {
    editMap = this.props.editMap || true;
    clocation = this.props.clocation?true:false;
    this.getMyLocation = this.getMyLocation.bind(this);
    this.addMarker = this.addMarker.bind(this);
  }
  componentWillReceiveProps(props) {
    const { refresh } = this.props;
    if (props.refresh !== refresh) {
      this.setState({ latitude: props.lat, longitude: props.lng });
      var latlng = { lat: props.lat, lng: props.lng }
      if (vMap) this.addMarker(vMap, latlng, this.props.address);
    }
  }
 
  addMarker = (map, location, address) => {
    if(marker) marker.setMap(null);
    marker = new window.google.maps.Marker({
      position: location,
      map: map,
      title: address
    });
    map.setCenter(location);
  }


    
  onDrawPolygon = (path, Zonename) => {
    var route = new window.google.maps.Polygon({
      path: path,
      strokeWeight: 1,
      fillOpacity: 0.45,
      zIndex: 1,
      content: Zonename
    });
    route.setMap(vMap);
    if (isZoneMap.infoWindow) isZoneMap.infoWindow.close();
    if (!isZoneMap.infoWindow)
      isZoneMap.infoWindow = new window.google.maps.InfoWindow();
    route.addListener("click", function(event) {
      let lat = event.latLng.lat()
      let lng = event.latLng.lng()
      isZoneMap.setState({ latitude: lat, longitude: lng })
      isZoneMap.addMarker(vMap, event.latLng, 'You');
      isZoneMap.props.handleLatlng(lat, lng);
    });

    route.addListener("mouseover", function(event) {
       isZoneMap.infoWindow.setContent(this.content);
       isZoneMap.infoWindow.setPosition(event.latLng);
       isZoneMap.infoWindow.open(vMap);
    });

    route.addListener("mouseout", function(event) {
      if (isZoneMap.infoWindow) isZoneMap.infoWindow.close();
   });

  };
  onDrawZoneArea = () => {
    ZoneArea=this.props.zonearea || [];
    if(ZoneArea.length>0&&!this.state.isPolygonViewed){
      ZoneArea.map(function(item, i) {
        var path = JSON.parse(item.boundaries);
        isZoneMap.onDrawPolygon(path, item.Zonename);
      });
      this.setState({ isPolygonViewed: true });
    }
  };


  getMyLocation = (e) => {
    let location = null;
    let latitude = null;
    let longitude = null;
    if (window.navigator && window.navigator.geolocation) {
      location = window.navigator.geolocation
    }
    if (location) {
      location.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        this.setState({ latitude: latitude, longitude: longitude })
        if(vMap) this.addMarker(vMap, { lat: latitude, lng: longitude }, 'You');
        this.props.handleLatlng(latitude, longitude);
      }.bind(this));
    }
  }
  render() {
    return (
      <div className="adduser">
      <Map
        id="myMap"
        options={{
          center: { lat: this.state.latitude, lng: this.state.longitude },
          zoom: 16
        }}
        onMapLoad={map => {
          vMap = map;
          if (editMap && clocation) this.getMyLocation();
          if (this.state.latitude && this.state.longitude) {
            this.addMarker(map, { lat: this.state.latitude, lng: this.state.longitude }, 'You');
          }
          this.onDrawZoneArea();
          // marker = new window.google.maps.Marker({
          //   position: { lat: this.state.latitude, lng: this.state.longitude },
          //   map: map,
          //   title: this.props.address
          // });
          if (editMap) {
            window.google.maps.event.addListener(map, "click", function (e) {
              let lat = e.latLng.lat()
              let lng = e.latLng.lng()
              this.setState({ latitude: lat, longitude: lng })
              this.addMarker(map, e.latLng, 'You');
              this.props.handleLatlng(lat, lng);
            }.bind(this));
          }
        }}
      />
      </div>
    );
  }
}

export default MapContainer;