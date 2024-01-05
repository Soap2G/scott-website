import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ImmobiliPostPage-style.css'

const BlogPostPage = () => {
  let { slug } = useParams();
  const [post, setPost] = useState(null);
  const [listingsData, setListingsData] = useState([]);

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
    <div className='post-page-container'>
      <div className="video-background">
        <div className="video-foreground">
          {post ? (
            <iframe title="Video Presentation" 
                    src={`https://www.youtube.com/embed/${post.video}?autoplay=1&controls=0&showinfo=0&mute=1&loop=1&playlist=${post.video}&vq=large`}
                    frameBorder="0" allowFullScreen>
            </iframe>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
        <div className="message-title">
          <center>
            <h1 >
            {post ? <span className="message-title">{post.address}</span> : 'Loading...'}
            </h1>
          </center>
        </div>
    </div>
  );
};

export default BlogPostPage;
