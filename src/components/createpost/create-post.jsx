import React, { useState } from 'react';
import './create-post-style.css'

const CreatePost = () => {
    const [post, setPost] = useState({
        title: '',
        content: '',
        // other fields as needed
    });

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // API call to backend to save the post
    };

    let squareMeters = 'm\u00B2';

    return (
      <div className='create-box'>
        <div className='message-title'
        style={{marginBottom: '2em'}}>
            Aggiungi immobile
        </div>
        <form onSubmit={handleSubmit}>
        <fieldset>
            <legend>Proprietà</legend>
            <table>
              <tr>
                <td class="lbl"><label for="description">Descrizione:</label></td>
                <td colspan="2"><textarea style={{ width: '100%'}} onChange={handleChange}  id="description" type="text" value={post.address} placeholder="..." /></td>
                <td></td>
              </tr>
            </table>
            <div class="frm">
                <table>
                    <tr>
                        <td class="lbl"><label for="address">Indirizzo:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="address" type="text" value={post.address} placeholder="Via/Piazza/Strada" /></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="floorSpace">Superficie:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="floorSpace" type="text" placeholder={squareMeters}/></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="dob">Locali:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="dob" type="number" placeholder="0" /></td>
                    </tr>
                </table>
            </div>

            <div class="frm">
                <table>
                    <tr>
                        <td class="lbl"><label for="city">Città:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="city" type="text" placeholder="Modena"/></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="addr">Posti auto:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="city" type="text" placeholder="1 in box privato/box in garage"/></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="ctry">Altro:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="ctry" type="text" placeholder="Giardino, ascensore..."/></td>
                    </tr>
                </table>
            </div>

        </fieldset>

        <fieldset>
            <legend>Documentazione</legend>
            <table>
            </table>
            <div class="frm">
                <table>
                    <tr>
                        <td class="lbl"><label for="map">Planimetria:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} /></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="map">Planimetria:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} /></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="map">Planimetria:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} /></td>
                    </tr>
                </table>
            </div>

            <div class="frm">
                <table>
                <tr>
                        <td class="lbl"><label for="map">Planimetria:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} /></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="map">Planimetria:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} /></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="map">Planimetria:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} /></td>
                    </tr>
                </table>
            </div>

        </fieldset>

        <fieldset>
            <legend>Foto/Video</legend>
            <table>
            </table>
            <div class="frm">
                <table>
                    <tr>
                        <td class="lbl"><label for="map">Foto copertina:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} /></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="map">Altre foto:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="file" value={post.map} multiple/></td>
                    </tr>
                    <tr>
                        <td class="lbl"><label for="map">Link video:</label></td>
                        <td><input class="fld" onChange={handleChange}  id="map" type="text" value={post.map} /></td>
                    </tr>
                </table>
            </div>
        </fieldset>

        <input 
          onChange={handleChange}  id="submit"
          type="submit" 
          value="Crea"
          style={{ cursor: 'pointer', fontWeight: "bold" }}
          />
        </form>
      </div>
    );
};

export default CreatePost;
