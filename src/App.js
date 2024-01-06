import React, { useRef, useState, useEffect } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Routes, Route } from 'react-router-dom';
import Introduction from './components/intro/Introduction';
import Immobili from './components/immobili/Immobili';
import { Message } from './components/rsvp/Message';
import ThemeButton from './contexts/ThemeButton';
import Footer from "./components/Footer.js";
import Header from "./components/Header.js";
import Transitions from "./components/Transitions";
import ImmobiliPostPage from './components/immobili/ImmobiliPostPage';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import CreatePost from "./components/createpost/create-post";



import './App.css';

function App() {
    const ref = useRef(null);
	
    const location = useLocation();

    // Initialize theme based on localStorage or default to 'light'
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Toggle theme and store in localStorage
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Apply theme to body
    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    // Set viewport height
    useEffect(() => {
        const setBodyHeight = () => {
            const vh = window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setBodyHeight();
        window.addEventListener('resize', setBodyHeight);

        return () => {
            window.removeEventListener('resize', setBodyHeight);
        };
    }, []);

    return (
        <ParallaxProvider>
            <I18nextProvider i18n={i18n}>
                <main ref={ref}>
                    <Header />
                    <div className={`theme-${theme}`}>
                        <ThemeButton onClick={toggleTheme} flipped={theme === 'dark'} />
                            <AnimatePresence 
                            initial={false}
                            mode='wait'
                            >
                                <Routes 
                                location={location}
                                key={location.pathname}
                                >
                                    <Route 
                                    exact
                                    path="/" 
                                    element={
                                        <>
                                            <Transitions>
                                                <Introduction />
                                                <Immobili />
                                                <GoogleReCaptchaProvider 
                                                    reCaptchaKey="6LfmHDEpAAAAALxj7qIMB5DwWa2HOdi7ABKfIs9V"
                                                    onLoad={() => console.log('reCAPTCHA Loaded')}
                                                    >
                                                    <Message />
                                                </GoogleReCaptchaProvider>
                                                <Footer />
                                            </Transitions>
                                            
                                        </>
                                    } />
                                    <Route
                                    exact
                                    path="/immobili/:slug" 
                                    element={
                                        <>
                                            <Transitions>
                                            <ImmobiliPostPage />
                                            <div style={{ 
                                                position: 'absolute', 
                                                left: 0,
                                                bottom: 0,
                                                width: '100%'
                                                }}>
                                                <Footer />
                                            </div>
                                            </Transitions>
                                        </>
                                    } />
                                    <Route
                                    exact
                                    path="/crea" 
                                    element={
                                        <>
                                            <Transitions>
                                            <CreatePost />
                                            <Footer />
                                            </Transitions>
                                        </>
                                    } />
                                </Routes>
                            </AnimatePresence>
                    </div>
                    
                </main>
            </I18nextProvider>
        </ParallaxProvider>
    );
}

export default App;
