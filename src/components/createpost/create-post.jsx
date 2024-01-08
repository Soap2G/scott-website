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


    const [post, setPost] = useState({
        name: '',
        coordinates: '',
        description: '',
        address: '',
        floorSpace: '',
        locali: '',
        city: '',
        box: '',
        other: '',
        video: '',
        // other fields as needed
    });
    const [map, setMap] = useState(null);
    const [doc1, setdoc1] = useState(null);
    const [doc2, setdoc2] = useState(null);
    const [doc3, setdoc3] = useState(null);
    const [doc4, setdoc4] = useState(null);
    const [doc5, setdoc5] = useState(null);
    const [thumb, setThumb] = useState(null);
    const [photos, setPhotos] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setSuccessMessage('');
        setPost({ ...post, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSuccessMessage('');
        if (e.target.id === "map") {
            setMap(e.target.files[0]);
        } else if (e.target.id === "doc1") {
            setdoc1(e.target.files[0]);
        } else if (e.target.id === "doc2") {
            setdoc2(e.target.files[0]);
        } else if (e.target.id === "doc3") {
            setdoc3(e.target.files[0]);
        } else if (e.target.id === "doc4") {
            setdoc4(e.target.files[0]);
        } else if (e.target.id === "doc5") {
            setdoc5(e.target.files[0]);
        } else if (e.target.id === "thumb") {
            setThumb(e.target.files[0]);
        } else if (e.target.id === "photos") {
            setPhotos(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', post.name);
        formData.append('description', post.description);
        formData.append('coordinates', [coordinates.lat,coordinates.lng]);
        formData.append('address', removeLastWordAndComma(address));
        formData.append('floorSpace', post.floorSpace);
        formData.append('locali', post.locali);
        formData.append('city', post.city);
        formData.append('box', post.box);
        formData.append('other', post.other);
        formData.append('video', post.video);
        if (map) formData.append('map', map);
        if (doc1) formData.append('doc1', doc1);
        if (doc2) formData.append('doc2', doc2);
        if (doc3) formData.append('doc3', doc3);
        if (doc4) formData.append('doc4', doc4);
        if (doc5) formData.append('doc5', doc5);
        if (thumb) formData.append('thumb', thumb);
        if (photos) {
            photos.forEach((photo, index) => {
              formData.append(`photo${index}`, photo);
            });
          }
        setIsSubmitting(false);
        try {
            const response = await fetch('/.netlify/functions/createPost', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Post created successfully');
                setSuccessMessage('Immobile creato correttamente');
                // Reset form values
                setPost({
                    name: '',
                    coordinates: '',
                    description: '',
                    address: '',
                    floorSpace: '',
                    locali: '',
                    city: '',
                    box: '',
                    other: '',
                    video: '',
                });
                setMap(null);
                setdoc1(null);
                setdoc2(null);
                setdoc3(null);
                setdoc4(null);
                setdoc5(null);
                setThumb(null);
                setPhotos(null);
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
                            <td><textarea style={{ width: '100%'}} onChange={handleChange}  id="description" type="text" placeholder="..." /></td>
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
                            {/* <td><input className="fld" onChange={handleChange}  id="address" type="text" placeholder="Via/Piazza/Strada" /></td> */}
                        </tr>
                        {/* <tr>
                            <td className="lbl"><label htmlFor="floorSpace">Superficie:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="floorSpace" type="text" placeholder={squareMeters}/></td>
                        </tr> */}
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
                            <td className="lbl"><label htmlFor="map">Planimetria:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="map" type="file" /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="map">Planimetria:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc1" type="file" /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="map">Planimetria:</label></td>
                            <td><input className="fld" onChange={handleFileChange}  id="doc2" type="file" /></td>
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
