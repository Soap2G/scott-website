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
    return (
        <section id='listings' style={{marginBottom: '5em'}}>
            <div className="message-title" style={{marginBottom: '1em'}}>
                <center>
                <h1 >
                Vetrina immobili
                </h1>
                </center>
            </div>
            <section className="listings-results">
            <center>
                <h2 >
                    Caricamento immobili...
                </h2>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
              </center>
            </section>
      </section>
    );
  }

  return (
    <section id='listings'>
      <div className="message-title">
        <center>
          <h1 >
            Vetrina immobili
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
                        <div className="listing-img" style={{ background: `url("${listing.thumb}") no-repeat center center`, backgroundSize: 'cover' }} key={index}>    
                          <div className="address" style={{bottom: '25%'}}>{listing.name}</div>
                          <div className="address">{listing.altAddress ? listing.altAddress : listing.address}</div>
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
                                  {listing.altAddress ? listing.altAddress : listing.address}
                                </div>
                                {/* <hr style={{color: 'var(--selection-color)'}}/> */}
                                <span className="floor-space">
                                  {listing.floorSpace} m&sup2;
                                </span>
                                
                                {/* <div className="bedrooms">
                                  <i className="fa fa-bed"></i>
                                  <span>{listing.rooms} locali</span>
                                </div> */}
                              </div>
                            </div>
                            <center>
                                <Link to={`/immobili/${listing.uniqueFolder}`}>
                                <span className="dettagli-button"
                                style={{ padding: '1em' }}
                                >
                                VEDI DETTAGLI
                                </span>
                                </Link>
                                </center>
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
