import styles from '../Hero/HeroSection.module.css';
import hero from '../../../assets/images/IMG/Hero.png';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../Context/AuthContext';
//import hero from '../../../assets/images/landingPage/hero.png';

function HeroSection() {
  const { loginData, userRole } = useAuthContext();


  return (
    <div className={styles.wrapper} id="home">
      <div className={styles.hero}>
        <h1>
          <span className={styles.when}>When</span> something <br />
          feels off, Scan it<span>.</span>
        </h1>
        <p>We help people figure out health issues and find the right care</p>
        <div className={styles.buttonContainer}>
          {loginData ? (
            userRole === 'patient' ? (
              <Link to="/patient-chatbot" className={styles.btn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{ marginRight: '8px' }}
                >
                  <path
                    fill="#000"
                    stroke="#fff"
                    strokeWidth={0.3}
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75a9.7 9.7 0 0 1-4.342-1.018c-.21-.104-.523-.114-1.01.005a9 9 0 0 0-.729.22l-.086.03c-.22.074-.46.154-.683.214c-1.427.382-2.733-.924-2.351-2.35c.06-.224.14-.463.214-.684l.03-.086c.085-.255.163-.495.22-.729c.12-.487.11-.8.005-1.01A9.7 9.7 0 0 1 2.25 12m6.5.25a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0zm4 0a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0zm4 0a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0z"
                  />
                </svg>
                Chat with Medscan
              </Link>
            ) : (
              <Link to="/doctor-chatbot" className={styles.btn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{ marginRight: '8px' }}
                >
                  <path
                    fill="#000"
                    stroke="#fff"
                    strokeWidth={0.3}
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75a9.7 9.7 0 0 1-4.342-1.018c-.21-.104-.523-.114-1.01.005a9 9 0 0 0-.729.22l-.086.03c-.22.074-.46.154-.683.214c-1.427.382-2.733-.924-2.351-2.35c.06-.224.14-.463.214-.684l.03-.086c.085-.255.163-.495.22-.729c.12-.487.11-.8.005-1.01A9.7 9.7 0 0 1 2.25 12m6.5.25a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0zm4 0a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0zm4 0a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0z"
                  />
                </svg>
                Chat with Medscan
              </Link>
            )
          ) : (
            <Link to="/patient-signup" className={styles.btn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ marginRight: '8px' }}
              >
                <path
                  fill="#000"
                  stroke="#fff"
                  strokeWidth={0.3}
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75a9.7 9.7 0 0 1-4.342-1.018c-.21-.104-.523-.114-1.01.005a9 9 0 0 0-.729.22l-.086.03c-.22.074-.46.154-.683.214c-1.427.382-2.733-.924-2.351-2.35c.06-.224.14-.463.214-.684l.03-.086c.085-.255.163-.495.22-.729c.12-.487.11-.8.005-1.01A9.7 9.7 0 0 1 2.25 12m6.5.25a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0zm4 0a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0zm4 0a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0z"
                />
              </svg>
              Get Started
            </Link>
          )}
        </div>
      </div>
      <div className={styles.illustration}>
        <img src={hero} alt="hero Image" width="1000px" />
      </div>
    </div>
  );
}

export default HeroSection;
