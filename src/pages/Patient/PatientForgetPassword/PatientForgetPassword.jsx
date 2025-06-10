import React, { useState } from 'react';
import styles from "../PatientForgetPassword/PatientForgetPassword.module.css";
import patientImg from '../../../assets/images/patientImages/patient.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faUserInjured } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import google from "../../../assets/images/DrSignUp/google.png";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedRole, setSelectedRole] = useState('patient');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    console.log('Recovery email sent to:', email);
    navigate('/patient-verify-code');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textSection}>
          
          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleOption} ${selectedRole === 'doctor' ? styles.selected : styles.unselected}`}
              onClick={() => setSelectedRole('doctor')}
            >
              Doctor
              <FontAwesomeIcon icon={faUserDoctor} style={{ marginLeft: '8px' }} />
            </div>
            <div
              className={`${styles.toggleOption} ${selectedRole === 'patient' ? styles.selected : styles.unselected}`}
              onClick={() => {
                setSelectedRole('patient');
                setTimeout(() => navigate('/patient-login'), 300);
              }}
            >
              Patient
              <FontAwesomeIcon icon={faUserInjured} style={{ marginLeft: '8px' }} />
            </div>
          </div>

          <h1 className={styles.title}>Forgot your password?</h1>
          <p className={styles.subtitle}>
            Don’t worry, happens to all of us. Enter your email below to recover your password
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              {emailError && <p className={styles.error}>{emailError}</p>}
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>
          </form>

          <div className={styles.divider}>
            <span>Or begin with</span>
          </div>

          <div className={styles.socialButtons}>
            <button className={styles.iconButton}>
              <FontAwesomeIcon icon={faFacebook} />
            </button>
            <button className={styles.iconButton}>
              <img src={google} alt="Google" className={styles.googleIcon} />
            </button>
          </div>

        </div>

        <div className={styles.imageSection}>
          <img src={patientImg} alt="Password recovery" className={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
