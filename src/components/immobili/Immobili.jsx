import React, { useState, useEffect } from 'react';
import "./immobili.css";
// import listingsData from '../../data/ListingsData';
import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const Immobili = () => {
  const [listingsData, setData] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      const response = await fetch('/.netlify/functions/createPost', {
        method: 'GET'
    });
      const listingsData = await response.json();
      setData(listingsData);
    }

    fetchListings();
  }, []);
  
  if (listingsData === undefined || listingsData.length === 0) {
    return "Sorry your filter did not match any listing";
  }

  return (
    <section id='listings'>
      <div className="message-title">
        <center>
          <h1 >
            Immobili
          </h1>
        </center>
      </div>
      <section className="listings-results">
          <div className="listings-container">
            {/* <div className="row"> */}
              {listingsData.map((listing, index) => {
                // Format the price inside the map function
                // const formattedPrice = listing.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                return (
                  <div className="my-col" key={index}>
                    <div className="listing">
                      <div className="listing-img" style={{ background: `url("${listing.thumb}") no-repeat center center` }} key={index}>    
                        <span className="address">{listing.address}</span>
                        <div className="details">
                          {/* <div className="my-col">
                            <img className="user-img-box" src={listing.userImg} alt="" />
                          </div> */}
                          <div className="my-col-9">
                            <div className="user-details">
                              <span className="user-name">{listing.user}</span>
                            </div>
                            <div className="listing-details">
                              <div className="floor-space">
                                <i className="fa fa-square-o"></i>
                                <span>{listing.floorSpace} m&sup2;</span>
                              </div>
                              <div className="bedrooms">
                                <i className="fa fa-bed"></i>
                                <span>{listing.rooms} locali</span>
                              </div>
                            </div>
                            <div className="view-btn">
                            <Link 
                              // eslint-disable-next-line
                              to={`/immobili/${listing.address.toLowerCase().replace(/[\.,]/g, '').replace(/\s/g, '-')}`}>
                              Dettagli
                            </Link>
                            </div>
                            <span className="post-date">Registrato il: {listing.postDate}</span>
                          </div>
                        </div>
                        {/* <div className="bottom-info">
                          <span className="price">${formattedPrice}</span>
                          <span className="location"><i className="fa fa-map-marker"></i> {listing.city}, {listing.state}</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          {/* </div> */}
        </section>
    </section>
  );
};

export default Immobili;
