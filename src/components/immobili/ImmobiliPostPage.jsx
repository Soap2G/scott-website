import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ImmobiliPostPage-style.css'

const BlogPostPage = () => {
  let { slug } = useParams();
  let squareMeters = 'm\u00B2';
  const [post, setPost] = useState(null);
  const [listingsData, setListingsData] = useState([]);

  const downloadFile = async (url, filename) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a new anchor element
        const anchor = document.createElement('a');
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
    let foundPost = listingsData.find(listing => listing.address.toLowerCase().replace(/[\.,]/g, '').replace(/\s/g, '-') === slug);
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
              {post ? <span className="message-title">{post.address}, {post.city}</span> : 'Loading...'}
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
          <hr />
          <div className="case"
          style={{
            textAlign: "left"}}
          >
              <h2 >
                Documentazione
              </h2>
              <div>
              {post && (
                        <button 
                            onClick={() => downloadFile(post.thumb, "Planimetria.webp")}
                        >
                            Download Planimetria
                        </button>
              )}
              </div>
          </div>
      </div>
    </center>
  );
};

export default BlogPostPage;
