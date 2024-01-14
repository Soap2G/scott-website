import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './create-post-style.css'
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ["places"];

const UpdatePost = () => {

// Find id of the db entry
let { updateSlug } = useParams();
const [listingsData, setListingsData] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false);

const [post, setPost] = useState('');

/* eslint-disable */
const [doc1, setdoc1] = useState(null);
const [doc2, setdoc2] = useState(null);
const [doc3, setdoc3] = useState(null);
const [doc4, setdoc4] = useState(null);
const [doc5, setdoc5] = useState(null);
const [doc1Name, setdoc1name] = useState(null);
const [doc2Name, setdoc2name] = useState(null);
const [doc3Name, setdoc3name] = useState(null);
const [doc4Name, setdoc4name] = useState(null);
const [doc5Name, setdoc5name] = useState(null);
const [thumb, setThumb] = useState(null);
const [photos, setPhotos] = useState(null);
const [newPhotos, setNewPhotos] = useState(null);
/* eslint-enable */
const [successMessage, setSuccessMessage] = useState('');

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
    let foundPost = listingsData.find(listing => listing.id === updateSlug);
    setPost(foundPost);
    }, [updateSlug, listingsData]);

function removeLastWordAndComma(address) {
    try{
        let parts = address.split(','); // Split the address by comma
        if (parts.length > 1) {
            parts.pop(); // Remove the last element
            return parts.join(','); // Join the array back into a string
        }
        return address; // Return the original address if there's no comma
    } catch {
        // console.log('Error in removeLastWordAndComma');
    }
}    

const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
});
// eslint-disable-next-line
const [address, setAddress] = useState('');
const [coordinates, setCoordinates] = useState(null);

const autocompleteRef = useRef(null);

const onPlaceChanged = () => {
    try {
        if (autocompleteRef.current && autocompleteRef.current.getPlace()) {
            const place = autocompleteRef.current.getPlace();
            const address = place.formatted_address;
            setAddress(address);
                
            // Extract the coordinates from the place object
            const coordinates = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            setCoordinates(coordinates); // Assuming you have a state [coordinates, setCoordinates]
        }
    } catch {
        // console.log('Error in onPlaceChanged');
    }
};

// Manage imges
const [selectedPhotos, setSelectedPhotos] = useState([]);

const togglePhotoSelection = (photo) => {
  if (selectedPhotos.includes(photo)) {
    setSelectedPhotos(selectedPhotos.filter(p => p !== photo));
  } else {
    setSelectedPhotos([...selectedPhotos, photo]);
  }
};

const removeSelectedPhotos = () => {
  if (post && post.photos) {
    const newPhotos = post.photos.filter(photo => !selectedPhotos.includes(photo));
    const removePhotos = post.photos.filter(photo => selectedPhotos.includes(photo));

    setNewPhotos(newPhotos)
    setPost({ ...post, 'removePhotos': removePhotos });
  }
};

// File and field changes
const handleChange = (e) => {
    setSuccessMessage('');
    setPost({ ...post, [e.target.id]: e.target.value });
};

const stateVars = {
    doc1: doc1,
    doc2: doc2,
    doc3: doc3,
    doc4: doc4,
    doc5: doc5
  };

const handleFileChange = (e) => {
    setSuccessMessage('');
    const file = e.target.files[0];
    const id = e.target.id;
    const setters = {
        doc1: [setdoc1, setdoc1name],
        doc2: [setdoc2, setdoc2name],
        doc3: [setdoc3, setdoc3name],
        doc4: [setdoc4, setdoc4name],
        doc5: [setdoc5, setdoc5name],
        thumb: [setThumb],
        photos: [setPhotos]
      };

    if (e.target.id === "thumb") {
        setThumb(e.target.files[0]);
    } else if (e.target.id === "photos") {
        setPhotos(Array.from(e.target.files));
    } else {
        setters[id][0](file);
        setters[id][1](file.name);
    }
};

// const handleFileChange = (e) => {
//     setSuccessMessage('');
//     const file = e.target.files[0];
//     const id = e.target.id;
  
//     const setters = {
//       doc1: [setdoc1, setdoc1name],
//       doc2: [setdoc2, setdoc2name],
//       doc3: [setdoc3, setdoc3name],
//       doc4: [setdoc4, setdoc4name],
//       doc5: [setdoc5, setdoc5name],
//       thumb: [setThumb],
//       photos: [setPhotos, () => Array.from(e.target.files)]
//     };
  
//     if (setters[id]) {
//       setters[id][0](setters[id][1] ? setters[id][1]() : file);
//     }
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    // Loop over updated docs
    for (let entry in stateVars){
        if (stateVars[entry]){
            formData.append(entry, stateVars[entry]);
            formData.append(`${entry}Name`, stateVars[entry].name);
        }
    }
    // Loop over everythin else
    for (let key in post) {      
        // Special case for coordinates
        if (key === 'coordinates') {
        formData.append('coordinates', coordinates ? [coordinates.lat, coordinates.lng] : post.coordinates);
        } else if (key === 'address') {
            // Special case for address
            formData.append('address', address !== '' ? removeLastWordAndComma(address) : post.address);
        }
        else if (key in stateVars) {
            continue
          } else if (key === 'thumb') {
            if (thumb) {
              formData.append('thumb', thumb);
            }
          } else if (key === 'photos') {
            try {
                post.photos = post.photos.filter(photo => newPhotos.includes(photo));
                newPhotos.forEach((photo, index) => {
                formData.append(`photo${index}`, photo);
                });
            } catch {
                    // console.log('Error in photos.forEach');

            }
          } else if (key === 'removePhotos') {
            try {
                post.removePhotos.forEach((photo, index) => {
                formData.append(`removephoto${index}`, photo);
                });
            } catch {
                    // console.log('Error in photos.forEach');
            }
          } else {
            formData.append(key, post[key]);
        }
    }
    if (thumb) formData.append('thumb', thumb);
    if (photos) {
        photos.forEach((photo, index) => {
            formData.append(`photoFile${index}`, photo);
        });
        }

    try {
        const response = await fetch(`/.netlify/functions/createPost/${post.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            // console.log('Post created successfully');
            setSuccessMessage('Immobile aggiornato correttamente');
            // Reset form values
            setPost(prevPost => {
                let newPost = {...prevPost};
                Object.keys(newPost).forEach(key => {
                    newPost[key] = '';
                });
                return newPost;
            });
            setdoc1(null);
            setdoc2(null);
            setdoc3(null);
            setdoc4(null);
            setdoc5(null);
            setThumb(null);
            setPhotos(null);
            setIsSubmitting(false);
        } else {
            console.error('Failed to update post');
            // Handle error
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
};


let squareMeters = 'm\u00B2';
const [isCheckboxChecked, setCheckboxChecked] = useState(false);

if (!isLoaded) return <div>Loading...</div>;

    return (
      <div className='create-box'>
        <div className='message-title'
        style={{marginBottom: '2em'}}>
            Modifica immobile
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset>
            <legend>Proprietà</legend>
            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td className="lbl"><label htmlFor="name">Titolo:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="name" type="text" value={post && post.name ? post.name : ''} placeholder={post && post.name ? '' : 'Casa indipendente'}/></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="description">Descrizione:</label></td>
                            <td><textarea style={{ width: '100%'}} onChange={handleChange}  id="description" type="text" value={post && post.description ? post.description : ''} placeholder={post && post.description ? '' : '...'} /></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="address">Indirizzo:</label></td>
                            <td>
                            <Autocomplete
                                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                onPlaceChanged={onPlaceChanged}
                            >
                                <input 
                                    className="fld" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    id="address" 
                                    type="text" 
                                    placeholder={post ? post.address : "Via/Piazza/Strada"}
                                />
                            </Autocomplete>
                            </td>
                        </tr>
                        <tr>
                        <td className="lbl" style={{ display: 'flex', alignItems: 'center' }}>
                            <label htmlFor="modifyAddress" style={{ marginRight: '0.5em' }}>Modifica indirizzo</label>
                            <input type="checkbox" id="modifyAddress" onChange={() => {
                                setCheckboxChecked(!isCheckboxChecked);
                                if (isCheckboxChecked) {
                                    setPost(prevPost => ({ ...prevPost, altAddress: '' }));
                                }
                            }} />
                        </td>
                            <td>
                                {isCheckboxChecked && (
                                    <input style={{ width: '100%'}} onChange={handleChange}  id="altAddress" type="text" value={post && post.altAddress ? post.altAddress : ''} placeholder={post && post.altAddress ? '' : post.address} />
                                )}
                            </td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td className="lbl"><label htmlFor="locali">Locali:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="locali" type="text" value={post && post.locali ? post.locali : ''} placeholder={post && post.locali ? '' : '0, 3-5'} /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="floorSpace">Superficie:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="floorSpace" type="text" value={post && post.floorSpace ? post.floorSpace : ''} placeholder={post && post.floorSpace ? '' : {squareMeters}}/></td>
                        </tr>
                        {/* <tr>
                            <td className="lbl"><label htmlFor="city">Città:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="city" type="text" placeholder="Modena"/></td>
                        </tr> */}
                        {/* <tr>
                            <td className="lbl"><label htmlFor="addr">Posti auto:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="box" type="text" placeholder="1 in box privato/box in garage"/></td>
                        </tr> */}
                        <tr>
                            <td className="lbl"><label htmlFor="other">Altro:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="other" type="text" value={post && post.other ? post.other : ''} placeholder={post && post.other ? '' : 'Giardino, ascensore...'}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </fieldset>

        <fieldset>
            <legend>Documentazione</legend>
            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc1" type="text" value={post && post.nameDoc1 ? post.nameDoc1 : ''} placeholder={post && post.nameDoc1 ? '' : (post && post.doc1Name ? post.doc1Name : 'documento 1')}/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc1" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc2" type="text" value={post && post.nameDoc2 ? post.nameDoc2 : ''} placeholder={post && post.nameDoc2 ? '' : (post && post.doc2Name ? post.doc2Name : 'documento 2')}/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc2" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc3" type="text" value={post && post.nameDoc3 ? post.nameDoc3 : ''} placeholder={post && post.nameDoc3 ? '' : (post && post.doc3Name ? post.doc3Name : 'documento 3')}/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc3" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc4" type="text" value={post && post.nameDoc4 ? post.nameDoc4 : ''} placeholder={post && post.nameDoc4 ? '' : (post && post.doc4Name ? post.doc4Name : 'documento 4')}/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc4" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc5" type="text" value={post && post.nameDoc5 ? post.nameDoc5 : ''} placeholder={post && post.nameDoc5 ? '' : (post && post.doc5Name ? post.doc5Name : 'documento 5')}/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc5" type="file" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* <div className="frm">
                <table>
                    <tbody>
                    <tr>
                            <td className="lbl"><label htmlFor="map">Planimetria:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc3" type="file" /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="map">Planimetria:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc4" type="file" /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="map">Planimetria:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc5" type="file" /></td>
                        </tr>
                    </tbody>
                </table>
            </div> */}

        </fieldset>

        <fieldset>
            <legend>Foto/Video</legend>
            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td className="lbl"><label htmlFor="map">Foto copertina:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="thumb" type="file" /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="map">Altre foto:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="photos" type="file" multiple/></td>
                        </tr>
                        
                        
                        <tr>
                        {(newPhotos && newPhotos.length > 0) || (!newPhotos && post && post.photos && post.photos.length > 0) ? (
                        <td 
                            className={`lbl ${selectedPhotos.length === 0 ? 'disabled' : ''}`}
                            id='remove-image-btn' 
                            onClick={selectedPhotos.length > 0 ? removeSelectedPhotos : null}
                        >
                            <span>Elimina foto</span> 
                        </td>
                        ) : ''}                         
                        <td>
                        {(post && Array.isArray(post.photos)) && 
                        (newPhotos ? newPhotos : post.photos).map((photo, index) => (
                            <span
                            className={`gallery-image-name ${selectedPhotos.includes(photo) ? 'selected' : ''}`}
                            key={index}
                            onClick={() => togglePhotoSelection(photo)}
                            >
                            {photo && typeof photo === 'string' ? photo.split('?')[0].split('/').pop() : ''}
                            </span>
                        ))}
                        </td>
                        </tr>
                        
                        <tr>
                            <td className="lbl"><label htmlFor="map">Link video:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="video" type="text" value={post && post.video ? post.video : ''} placeholder={post && post.video ? '' : '...'}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </fieldset>

        <input 
        //   onChange={handleChange}  
          id="submit"
          type="submit" 
          value="Aggiorna"
          disabled={isSubmitting}
          style={isSubmitting ? { cursor: 'not-allowed', fontWeight: "bold", backgroundColor: 'grey' } : { cursor: 'pointer', fontWeight: "bold" }}
          />
        </form>
        {successMessage && <div className='success-message'>{successMessage}</div>}
      </div>
    );
};

export default UpdatePost;
