import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ImmobiliPostPage-style.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from '../../assets/marker.png'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class SimpleSlider extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  render() {
    return (
    <div>
        <div className="case"
          style={{
            textAlign: "left"}}
          >
            <center>
              <h2 >
                Galleria
              </h2>
            </center>
          </div>
        <div className='main-gallery'>
        <Slider
          asNavFor={this.state.nav2}
          ref={slider => (this.slider1 = slider)}
        >
            {this.props.children}
        </Slider>
        </div>
        <div className='thumb-gallery'>
        <Slider
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          slidesToShow={3}
          swipeToSlide={true}
          focusOnSelect={true}
        >
          {this.props.children}
        </Slider>
        </div>
      </div>
    );
  }
}

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
    const filename = decodeURIComponent(segments[uploadsIndex + 2].split('?')[0]);
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

  let photosArray = [];
  if (post) {
    try {
      photosArray = post.photos.map((photoUrl, index) => ({
      original: photoUrl,
      thumbnail: photoUrl,
      originalAlt: `photo ${index + 1}`,
      thumbnailAlt: `thumbnail ${index + 1}`,
    }));
    } catch (err) {}
  }

  return (
    <center>
      {post && post.video ? (
        <div className="video-background">
          <div className="video-foreground">
              <iframe title="Video Presentation" 
                      src={`https://www.youtube.com/embed/${post.video}?autoplay=1&controls=0&showinfo=0&mute=1&loop=1&playlist=${post.video}&vq=large`}
                      frameBorder="0" allowFullScreen>
              </iframe>
          </div>
        </div>
        ) : null}

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
      <div className='parent-container'>
        <div className='post-page-container'>
            
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
                            {post.doc1 && (
                            <div style={{ display: 'flex' }} onClick={() => downloadFile(post.doc1)}>
                              <span className='download-btn'> </span>
                              <span style={{lineHeight: '2em', cursor: 'pointer'}}> {post.nameDoc1 ? post.nameDoc1 : "Documento"}</span>
                            </div>
                            )}
                            {post.doc2 && (
                            <div style={{ display: 'flex' }} onClick={() => downloadFile(post.doc2)}>
                              <span className='download-btn'> </span>
                              <span style={{lineHeight: '2em', cursor: 'pointer'}}> {post.nameDoc2 ? post.nameDoc2 : "Documento"}</span>
                            </div>
                            )}
                            {post.doc3 && (
                            <div style={{ display: 'flex' }} onClick={() => downloadFile(post.doc3)}>
                              <span className='download-btn'> </span>
                              <span style={{lineHeight: '2em', cursor: 'pointer'}}> {post.nameDoc3 ? post.nameDoc3 : "Documento"}</span>
                            </div>
                            )}
                            {post.doc4 && (
                            <div style={{ display: 'flex' }} onClick={() => downloadFile(post.doc4)}>
                              <span className='download-btn'> </span>
                              <span style={{lineHeight: '2em', cursor: 'pointer'}}> {post.nameDoc4 ? post.nameDoc4 : "Documento"}</span>
                            </div>
                            )}
                            {post.doc5 && (
                            <div style={{ display: 'flex' }} onClick={() => downloadFile(post.doc5)}>
                              <span className='download-btn'> </span>
                              <span style={{lineHeight: '2em', cursor: 'pointer'}}> {post.nameDoc5 ? post.nameDoc5 : "Documento"}</span>
                            </div>
                            )}
                          </div>
                )}
              </div>
            </div>
        </div>
        <div className='map-immobile'>
        {post && (
          <MapContainer center={[post.coordinates.split(',')[0], post.coordinates.split(',')[1]]} zoom={16} style={{ height: "100%" }}>
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
      </div>
      {photosArray.length > 0 && (
          <div style={{marginTop: '5em'}}>
            <SimpleSlider>
              {photosArray.map((photo, index) => (
                <div key={index}>
                  <img src={photo.original} alt={photo.originalAlt} />
                </div>
              ))}
            </SimpleSlider>
          </div>
        )}
    </center>
  );
};

export default BlogPostPage;
