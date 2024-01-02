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
                Viale Gaetano Moreali 11 <br/>
                41124 MODENA (MO)
          </div>
          <div className="footer-column">
            <div className="footer-heading">
              Contatti
            </div>
            email@gmail.com <br/>
            333 4444444
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