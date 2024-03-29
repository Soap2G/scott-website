import React, { useState, useRef } from 'react';
import './create-post-style.css'
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ["places"];

const CreatePost = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    function removeLastWordAndComma(address) {
        let parts = address.split(','); // Split the address by comma
        if (parts.length > 1) {
            parts.pop(); // Remove the last element
            return parts.join(','); // Join the array back into a string
        }
        return address; // Return the original address if there's no comma
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
            
            // this.setState(prevState => ({
            //     post: {
            //       ...prevState.post,
            //       address: address,
            //       coord: coordinates
            //     }
            //   }));
        }
    };


    // const [post, setPost] = useState({
    //     name: '',
    //     coordinates: '',
    //     description: '',
    //     address: '',
    //     floorSpace: '',
    //     locali: '',
    //     city: '',
    //     box: '',
    //     other: '',
    //     video: '',
    //     nameDoc1: '',
    //     nameDoc2: '',
    //     nameDoc3: '',
    //     nameDoc4: '',
    //     nameDoc5: ''
    //     // other fields as needed
    // });
    const [post, setPost] = useState('');

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
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setSuccessMessage('');
        setPost({ ...post, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSuccessMessage('');
        if (e.target.id === "doc1") {
            setdoc1(e.target.files[0]);
            setdoc1name(e.target.files[0].name);
        } else if (e.target.id === "doc2") {
            setdoc2(e.target.files[0]);
            setdoc2name(e.target.files[0].name);
        } else if (e.target.id === "doc3") {
            setdoc3(e.target.files[0]);
            setdoc3name(e.target.files[0].name);
        } else if (e.target.id === "doc4") {
            setdoc4(e.target.files[0]);
            setdoc4name(e.target.files[0].name);
        } else if (e.target.id === "doc5") {
            setdoc5(e.target.files[0]);
            setdoc5name(e.target.files[0].name);
        } else if (e.target.id === "thumb") {
            setThumb(e.target.files[0]);
        } else if (e.target.id === "photos") {
            setPhotos(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        for (let key in post) {
            formData.append(key, post[key]);
        }
        // Special case for coordinates
        formData.append('coordinates', [coordinates.lat, coordinates.lng]);
        // Special case for address
        formData.append('address', removeLastWordAndComma(address));

        if (doc1) {
            formData.append('doc1', doc1);
            formData.append('doc1Name', doc1Name);
        }
        if (doc2) {
            formData.append('doc2', doc2);
            formData.append('doc2Name', doc2Name);
        }
        if (doc3) {
            formData.append('doc3', doc3);
            formData.append('doc3Name', doc3Name);
        }
        if (doc4) {
            formData.append('doc4', doc4);
            formData.append('doc4Name', doc4Name);
        }
        if (doc5) {
            formData.append('doc5', doc5);
            formData.append('doc5Name', doc5Name);
        }

        if (thumb) formData.append('thumb', thumb);
        if (photos) {
            photos.forEach((photo, index) => {
              formData.append(`photo${index}`, photo);
            });
          }

        try {
            const response = await fetch('/.netlify/functions/createPost', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Post created successfully');
                setSuccessMessage('Immobile creato correttamente');
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
                console.error('Failed to create post');
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
            Aggiungi immobile
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset>
            <legend>Proprietà</legend>
            {/* <table>
                <tbody>
                    <tr>
                        <td className="lbl"><label htmlFor="description">Descrizione:</label></td>
                        <td><textarea style={{ width: '100%'}} onChange={handleChange}  id="description" type="text" placeholder="..." /></td>
                        <td></td>
                    </tr>
                </tbody>
            </table> */}
            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td className="lbl"><label htmlFor="name">Titolo:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="name" type="text" placeholder="Casa indipendente"/></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="description">Descrizione:</label></td>
                            <td><textarea style={{ width: '100%'}} onChange={handleChange}  id="description" type="text" placeholder="..." required/></td>
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
                                    placeholder="Via/Piazza/Strada" 
                                    required
                                />
                            </Autocomplete>
                            </td>
                        </tr>
                        {address && (
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
                                        <input style={{ width: '100%'}} onChange={handleChange}  id="altAddress" type="text" placeholder={address ? address : "Via/Piazza/Strada"} />
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td className="lbl"><label htmlFor="locali">Locali:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="locali" type="text" placeholder="0, 3-5" /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="floorSpace">Superficie:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="floorSpace" type="text" placeholder={squareMeters}/></td>
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
                            <td className="lbl"><label htmlFor="ctry">Altro:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="other" type="text" placeholder="Giardino, ascensore..."/></td>
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
                            <td><input className="fld" onChange={handleChange}  id="nameDoc1" type="text" placeholder="nome doc 1"/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc1" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc2" type="text" placeholder="nome doc 2"/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc2" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc3" type="text" placeholder="nome doc 3"/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc3" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc4" type="text" placeholder="nome doc 4"/></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc4" type="file" /></td>
                        </tr>
                        <tr>
                            <td><input className="fld" onChange={handleChange}  id="nameDoc5" type="text" placeholder="nome doc 5"/></td>
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
                            <td className="lbl"><label htmlFor="map">Link video:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="video" type="text" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </fieldset>

        <input 
        //   onChange={handleChange}  
          id="submit"
          type="submit" 
          value="Crea"
          disabled={isSubmitting}
          style={isSubmitting ? { cursor: 'not-allowed', fontWeight: "bold", backgroundColor: 'grey' } : { cursor: 'pointer', fontWeight: "bold" }}
          />
        </form>
        {successMessage && <div className='success-message'>{successMessage}</div>}
      </div>
    );
};

export default CreatePost;
