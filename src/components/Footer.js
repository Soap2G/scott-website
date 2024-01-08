import React from "react";
// import { Icon } from '@iconify/react';
// import { useTranslation } from 'react-i18next';
import './Footer.css'
 
const Footer = () => {
  // const { t } = useTranslation();

  return (
    <div className="box">
      <div className="footer-div">
        <div className="footer-row">
          {/* <div className="footer-column">
              <div>
                Sandro Cottafava <br/>
                Via xyz modena
              </div>
          </div> */}
          <div className="footer-column">
            <div className="footer-heading">
              Scott SRL
            </div>
                <span>Viale Gaetano Moreali 11
                41124 MODENA (MO)</span> <br/>
                
                <span
                style={{ lineHeight: '2rem' }}
                >P. IVA: 03656540360</span>
          </div>
          <div
           style={{ textAlign: 'right' }}
           className="footer-column">
            <div className="footer-heading">
              Contatti
            </div>
            <a 
            className="footer-link"
            href="mailto:sandro.cottafava@libero.it">sandro.cottafava@libero.it</a> <br/>
            <a 
            className="footer-link"
            href="tel:+393357110040">+39 335 711 0040</a>
          </div>
        </div>
        <div className="footer-case">
          Made by GG
        </div>
      </div>
    </div>
  );
};

export default Footer;