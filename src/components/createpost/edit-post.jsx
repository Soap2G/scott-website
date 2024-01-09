import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from "firebase/firestore"; 
import { db } from "../auth/firebase";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";



const CreatePost = () => {

  const [listingsData, setData] = useState([]);

  async function deleteListing(id, uniqueFolder) {
    try {
      // Delete the document
      await deleteDoc(doc(db, "posts", id));
    //   console.log("Document successfully deleted!");
  
      // Delete the folder in storage
      const storage = getStorage();
      const folderRef = ref(storage, `/uploads/${uniqueFolder}`);
  
      // List all files in the folder
      const res = await listAll(folderRef);
  
      // Delete all files in the folder
      res.items.forEach((itemRef) => {
        deleteObject(itemRef);
      });
  
    //   console.log("Folder successfully deleted!");
      window.location.reload();
    } catch (error) {
    //   console.error("Error removing document or folder: ", error);
    }
  }

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
        <section id='listings'>
            <div className="message-title" style={{marginBottom: '5em'}}>
                <center>
                <h1 >
                    Modifica immobili
                </h1>
                </center>
            </div>
            <section className="listings-results" style={{height: '80vh'}}>
                <div className="message-title">
                    <center>
                        Nessun immobile trovato
                    </center>
                </div>
            </section>
      </section>
    );
  }

  return (
    <section id='listings'>
      <div className="message-title">
        <center>
          <h1 >
            Modifica immobili
          </h1>
        </center>
      </div>
      <section className="listings-results" style={{height: '80vh'}}>
        <Link to={`/crea`}>
            <span className="add-button" style={{ padding: '1em' }}>
                + AGGIUNGI NUOVO
            </span>
        </Link>
          <div className="listings-container">
              {listingsData.map((listing, index) => {
                return (
                  <div className="my-col" key={index}>
                    <div className="listing">
                        <div className="listing-img" style={{ background: `url("${listing.thumb}") no-repeat center center` }} key={index}>    
                          <div className="address" style={{bottom: '25%'}}>{listing.name}</div>
                          <div className="address">{listing.altAddress ? listing.altAddress : listing.address}</div>
                          <div className="details">
                          <center style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', gap: '1em' }}>
                                <Link to={`/modifica/${listing.id}`}>
                                    <span className="dettagli-button" style={{ padding: '1em' }}>
                                        MODIFICA
                                    </span>
                                </Link>
                                <span onClick={() => deleteListing(listing.id, listing.uniqueFolder)} className="delete-button" style={{ padding: '1em', fontWeight: '400', cursor:'pointer'}}>
                                    ELIMINA
                                </span>
                            </center>
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </section>
    </section>
  );
};
export default CreatePost;
