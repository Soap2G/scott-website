import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ImmobiliPostPage-style.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from '../../assets/marker.png'


const BlogPostPage = () => {
  let { slug } = useParams();
  let squareMeters = 'm\u00B2';
  const [post, setPost] = useState(null);
  const [listingsData, setListingsData] = useState([]);

  const myIcon = L.icon({
    iconUrl: marker,
    iconSize: [48, 48], // size of the icon
  });

  const downloadFile = async (url) => {
    // Split the URL into segments
    const segments = url.split('/');

    // Get the filename
    const uploadsIndex = segments.indexOf('uploads');
    const filename = segments[uploadsIndex + 2].split('?')[0];
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a hidden anchor element
        const anchor = document.createElement('a');
        anchor.style.display = 'none'; // Ensure the element is not visible
        anchor.href = blobUrl;
        anchor.download = filename || 'download';

        // Append anchor to the body and trigger the download
        document.body.appendChild(anchor);
        anchor.click();

        // Clean up
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
  };


  useEffect(() => {
    async function fetchListings() {
      const response = await fetch('/.netlify/functions/createPost');
      const data = await response.json();
      setListingsData(data);
    }

    fetchListings();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    let foundPost = listingsData.find(listing => listing.uniqueFolder === slug);
    setPost(foundPost);
  }, [slug, listingsData]);

  return (
    <center>
      {post && post.video && (
        <div className="video-background">
          <div className="video-foreground">
              <iframe title="Video Presentation" 
                      src={`https://www.youtube.com/embed/${post.video}?autoplay=1&controls=0&showinfo=0&mute=1&loop=1&playlist=${post.video}&vq=large`}
                      frameBorder="0" allowFullScreen>
              </iframe>
          </div>
        </div>
        )}
      <div className='post-page-container'>
          <div className="message-title">
            <center>
              <h1 >
              {post ? <span className="message-title">{post.address}</span> : 'Loading...'}
              </h1>
            </center>
          </div>
          <div className="case"> 
              <p>
                {post ? `${post.locali} locali | ${post.floorSpace} ${squareMeters}` : 'Loading...'}
              </p>
          </div>
          <div className="case"
          style={{
            textAlign: "left"}}
          >
              <h2 >
                Descrizione
              </h2>
              <p>
                {post ? post.description : 'Loading...'}
              </p>
          </div>

          <div className="case"
          style={{
            textAlign: "left",
            marginTop: "2em"
          }}
          >
              <h2 >
                Altre informazioni
              </h2>
              <p>
                {post ? post.other : 'Loading...'}
              </p>
          </div>

          <hr />
          <div className="case"
          style={{
            textAlign: "left",
            marginTop: "2em"
          }}
          >
              <h2 >
                Documentazione
              </h2>
              <div>
              {post && (
                        <div>
                          <div style={{ display: 'flex' }} onClick={() => downloadFile(post.map)}>
                            <span className='download-btn'> </span>
                            <span style={{lineHeight: '2em', cursor: 'pointer'}}> Planimetria</span>
                          </div>

                          <div style={{ display: 'flex' }} onClick={() => downloadFile(post.doc1)}>
                            <span className='download-btn'> </span>
                            <span style={{lineHeight: '2em', cursor: 'pointer'}}> Documento aux 1</span>
                          </div>

                          <div style={{ display: 'flex' }} onClick={() => downloadFile(post.doc2)}>
                            <span className='download-btn'> </span>
                            <span style={{lineHeight: '2em', cursor: 'pointer'}}> Documento aux 2</span>
                          </div>
                        </div>
              )}
              </div>
          </div>
      </div>
      <div className='map-immobile'>
      {post && (
        <MapContainer center={[post.coordinates.split(',')[0], post.coordinates.split(',')[1]]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[post.coordinates.split(',')[0], post.coordinates.split(',')[1]]} icon={myIcon}>
            <Popup>
            {post.address}
            </Popup>
          </Marker>
        </MapContainer>
      )}
      </div>
    </center>
  );
};

export default BlogPostPage;
