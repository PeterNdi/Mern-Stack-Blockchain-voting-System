import React from "react";

import "./Footer.css";

const Footer = () => (
  <>
    <div className="footer-block"></div>
    <div className="footer">
      <div className="footer-container">
        <p className="main-footer">
          Made with <i className="fas fa-heartbeat" /> by{" "}
          <a
            className="profile"
            href="https://www.dkut.ac.ke/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dekut
          </a>
          .
        </p>
      </div>
    </div>
  </>
);

export default Footer;
