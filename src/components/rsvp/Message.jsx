import "./message-style.css";
import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';


export const Message = () => {
	const { t } = useTranslation();


  const [hasSubmitted, setHasSubmitted] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const form = useRef();

  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (executeRecaptcha) {
      setIsRecaptchaReady(true);
    }
  }, [executeRecaptcha]);

  //----------------------------------
  // Update state of the recaptcha
  //----------------------------------
  const verifyRecaptcha = async (token) => {
    try {
      const response = await fetch('/.netlify/functions/recaptcha-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      
      if (response.ok && data && 'success' in data) {
        return data.success;
      } else {
        // Handle unexpected response format
        console.error('Unexpected response format:', data);
        return false;
      }

    } catch (error) {
      console.error('Error verifying reCAPTCHA:', error);
      return false;
    }
  };
  

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!isRecaptchaReady) {
      console.error('Execute recaptcha not yet available');
      setSubmissionMessage("Il servizio non è ancora disponibile. Attendere prego.");
      return;
    }
  
    // Get the reCAPTCHA token
    const token = await executeRecaptcha('submit_form');
    const isVerified = await verifyRecaptcha(token);

    // const getRandomMessage = () => {
    //   const randomIndex = Math.floor(Math.random() * defaultMessage.length);
    //   return defaultMessage[randomIndex];
    // };

    // const formElements = form.current.elements;
    // if (!formElements.number.value) {
    //   formElements.number.value = defaultNumber;
    // }
    // if (!formElements.message.value) {
    //   formElements.message.value = formElements.message.value || getRandomMessage();
    // }

    // Include the reCAPTCHA token in my form data
    // const formData = new FormData(form.current);
    // formData.append('g-recaptcha-response', token);

    setIsSubmitting(true);

    if (!isVerified) {
      setSubmissionMessage("La verifica reCAPTCHA è fallita. Riprovare");
      setIsSubmitting(false);
      return;
    }

    emailjs.sendForm('service_t8sxek9', 'template_d3ic149', form.current, "9477ur8cVpY-mQuB7")
      .then((result) => {
          console.log(result.text);
          setSubmissionMessage("Grazie, la mail è stata inviata con successo");
          setHasSubmitted(true);
      }, (error) => {
          console.log(error.text);
          setSubmissionMessage("Errore nell'invio. Riprovare.");
          setHasSubmitted(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section className="message-section">
      <center>
        <div className="message-title">
          <h1 >
            Contatti
          </h1>
        </div>

        <div
          // className=" op-class"
        >
          <form ref={form} onSubmit={sendEmail}>
          <input type="text" name="fullName" placeholder={t('fullName')} id="rsvpname" required/>
          <input type="text" name="email" placeholder='e-mail' id="rsvpemail" required/>
          <input type="text" name="subject" placeholder='Oggetto' id="rsvpnumber" />
          <textarea name="message" placeholder='Messaggio' id="textrsvp" />
          <input 
          id="submit"
          type="submit" 
          value={t('send')}
          disabled={!isRecaptchaReady || isSubmitting} 
          style={{ cursor: 'pointer', fontWeight: "bold" }}
          />
          {submissionMessage && <div className={hasSubmitted ? 'success-message' : 'error-message'}>{submissionMessage}</div>}
          </form>
        </div>
      </center>
    </section>
  );
};