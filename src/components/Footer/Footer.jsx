import React from "react";
import styles from "./Footer.module.css";
import logo from "../../assets/images/landingPage/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareXTwitter,
  faFacebook,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const handleSocialClick = (platform) => {
    // Add your social media links here
    const socialLinks = {
      twitter: "https://twitter.com/medscan",
      facebook: "https://facebook.com/medscan",
      linkedin: "https://linkedin.com/company/medscan",
      instagram: "https://instagram.com/medscan",
    };
    window.open(socialLinks[platform], "_blank");
  };

  return (
    <>
      <section className={styles.ctaSection}>
        <h2>
          You're only one click away
          <br />
          from a life-changing journey
        </h2>
        <button className={styles.ctaButton}>Try Medscan Now</button>
        <div className={styles.ctaInfo}>
          <span>✔ 350+ renowned Doctors</span>
          <span>✔ Virtual health assistant powered by AI</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <img src={logo} alt="Medscan Logo" className={styles.logo} />
            <p>
              Improving human health through the combination of cutting-edge
              technologies and top medical expertise.
            </p>
            <div className={styles.socialIcons}>
              <button
                className={styles.iconButton}
                onClick={() => handleSocialClick('twitter')}
                aria-label="Follow us on Twitter"
              >
                <FontAwesomeIcon icon={faSquareXTwitter} />
              </button>
              <button
                className={styles.iconButton}
                onClick={() => handleSocialClick('facebook')}
                aria-label="Follow us on Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </button>
              <button
                className={styles.iconButton}
                onClick={() => handleSocialClick('linkedin')}
                aria-label="Follow us on LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </button>
              <button
                className={styles.iconButton}
                onClick={() => handleSocialClick('instagram')}
                aria-label="Follow us on Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </button>
            </div>
          </div>

          <div className={styles.footerColumns}>
            <div className={styles.column}>
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About us</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/join-doctor">Join as a Doctor</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Product</h4>
              <ul>
                <li><a href="/ai-assistant">AI Health Assistant</a></li>
                <li><a href="/ai-doctor">AI Doctor</a></li>
                <li><a href="/supplements">Supplements</a></li>
                <li><a href="/lab-tests">Lab Test Interpretation</a></li>
                <li><a href="/symptom-checker">Symptom Checker</a></li>
                <li><a href="/second-opinion">Second Opinion</a></li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Resources</h4>
              <ul>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/knowledge-base">Knowledge Base</a></li>
                <li><a href="/symptoms-guide">Symptoms Guide</a></li>
                <li><a href="/glossary">Glossary</a></li>
                <li><a href="/articles">All Articles</a></li>
                <li><a href="/doctors">All Doctors</a></li>
                <li><a href="/use-cases">Use Cases</a></li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Trust</h4>
              <ul>
                <li><a href="/terms">Terms of use</a></li>
                <li><a href="/privacy">Privacy policy</a></li>
                <li><a href="/cookies">Cookie policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className={styles.cookieBar}>
          <span>This site uses <a href="#">cookies</a> to enhance the quality of its services.</span>
          <button className={styles.cookieBtn}>Accept</button>
        </div> */}
      </footer>
    </>
  );
};

export default Footer;
