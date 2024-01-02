import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import listingsData from '../../data/ListingsData';
import './ImmobiliPostPage-style.css'

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    let foundPost = listingsData.find(listing => listing.city === slug);
    setPost(foundPost);
  }, [slug]);

  return (
    <div>
      {post ? <span className="user-name">{post.user}</span> : 'Loading...'}
    </div>
  );
};

export default BlogPostPage;
