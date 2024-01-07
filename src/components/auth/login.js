import React, { useState } from 'react';
import { auth } from './firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for navigation
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [hasSubmitted, sethasSubmitted] = useState(false);
    const location = useLocation();


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential && userCredential.user) {
                sethasSubmitted(true)
                setSubmissionMessage('Autenticato');
                // console.log('Login successful');
                const from = location.state?.from?.pathname || '/';
                // console.log(from);
                navigate(from);

            } else {
                // console.log('Login failed');
                setSubmissionMessage('Email o password errati, riprova');
            }
        } catch (error) {
            console.error("Error signing in with email and password", error);
            setSubmissionMessage('Email o password errati, riprova');
            // Optionally handle login failure, like displaying an error message
        }
    };

    return (
        <div>
            <center>
                <h1 >
                <span className="message-title">Effettual il login per procedere</span>
                </h1>
                <form onSubmit={handleSubmit} style={{ marginTop: '2em' }}>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                    <input 
                        id="submit"
                        type="submit" 
                        value="ENTRA"
                        style={{ cursor: 'pointer', fontWeight: "bold", marginTop: '2em' }}
                        />
                        {submissionMessage && <div className={hasSubmitted ? 'success-message' : 'error-message'}>{submissionMessage}</div>}
                </form>
            </center>
        </div>
    );
}

export default Login;
