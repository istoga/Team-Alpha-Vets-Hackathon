import React, { useState, useEffect, useRef } from 'react';
import { Row, Container, Col } from 'react-bootstrap';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import  VaForm  from '../components/VaForm';

let googleAPI = process.env.REACT_APP_GOOGLE_MAP;


const MapContainer = ({ google, center, markers }) => {
  const [mapCenter, setMapCenter] = useState(center);
  
  const handleMarkerClick = (markerProps, marker) => {
    const latLng = marker.getPosition();
    const lat = latLng.lat();
    const lng = latLng.lng();
    setMapCenter({ lat, lng });
  };

  useEffect(() => {
    if (markers.length > 0) {
      const { lat, lng } = markers[0];
      setMapCenter({ lat, lng });
    }
  }, [markers]);

  return (
    <>
    <VaForm></VaForm>
    <div style={{ width: '100%', height: '400px' }}>
      <Map google={google} zoom={10} center={mapCenter}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={handleMarkerClick}
          />
        ))}
      </Map>
    </div>
    </>
  );
};

const FormsScreen = ({ google }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const userLocationBtnRef = useRef();

  const handleUserLocation = () => {
    if (navigator.geolocation) {
      const userLocationBtn = userLocationBtnRef.current;
      setLoading(true);
      userLocationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
          userLocationBtn.disabled = false;
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation(null);
          setLoading(false);
          userLocationBtn.disabled = false;
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setUserLocation(null);
    }
  };

  useEffect(() => {
    if (userLocation) {
      setMarkers([{ lat: userLocation.lat, lng: userLocation.lng }]);
    } else {
      setMarkers([]);
    }
  }, [userLocation]);

  return (
    <Container>
      <Row>
        <Col>
          <div className='mb-3'>
            <h1>FormsScreen</h1>

            <div>
              <button ref={userLocationBtnRef} onClick={handleUserLocation} disabled={loading}>
                {loading ? (
                  <>
                    Searching... <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>🐴</span>
                  </>
                ) : (
                  'Search By User Location'
                )}
              </button>
              {userLocation && (
                <div>
                  <h2>User Location:</h2>
                  <p>Latitude: {userLocation.lat}</p>
                  <p>Longitude: {userLocation.lng}</p>
                </div>
              )}
              <h2>Map:</h2>
              <MapContainer google={google} center={userLocation} markers={markers} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: googleAPI,
})(FormsScreen);
