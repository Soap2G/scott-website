import React, { useState } from 'react';
import './create-post-style.css'

const CreatePost = () => {
    const [post, setPost] = useState({
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


    const handleChange = (e) => {
        setPost({ ...post, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
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

        const formData = new FormData();
        formData.append('description', post.description);
        formData.append('address', post.address);
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
        if (photos) formData.append('photos', photos);

        try {
            const response = await fetch('/.netlify/functions/createPost', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Post created successfully');
                // Handle successful response
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

    return (
      <div className='create-box'>
        <div className='message-title'
        style={{marginBottom: '2em'}}>
            Aggiungi immobile
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset>
            <legend>Proprietà</legend>
            <table>
                <tbody>
                    <tr>
                        <td className="lbl"><label htmlFor="description">Descrizione:</label></td>
                        <td><textarea style={{ width: '100%'}} onChange={handleChange}  id="description" type="text" placeholder="..." /></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td className="lbl"><label htmlFor="address">Indirizzo:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="address" type="text" placeholder="Via/Piazza/Strada" /></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="floorSpace">Superficie:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="floorSpace" type="text" placeholder={squareMeters}/></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="locali">Locali:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="locali" type="number" placeholder="0" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="frm">
                <table>
                    <tbody>
                        <tr>
                            <td className="lbl"><label htmlFor="city">Città:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="city" type="text" placeholder="Modena"/></td>
                        </tr>
                        <tr>
                            <td className="lbl"><label htmlFor="addr">Posti auto:</label></td>
                            <td><input className="fld" onChange={handleChange}  id="box" type="text" placeholder="1 in box privato/box in garage"/></td>
                        </tr>
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

            <div className="frm">
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
            </div>

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
          style={{ cursor: 'pointer', fontWeight: "bold" }}
          />
        </form>
      </div>
    );
};

export default CreatePost;
