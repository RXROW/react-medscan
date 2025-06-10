import React, { useState } from 'react';
import styles from '../VerifyCode/VerifyCode.module.css';
import doctorImg from '../../../../assets/images/DrSignUp/DR.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faUserInjured } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const VerifyCode = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [code, setCode] = useState(['', '', '', '']);

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updatedCode = [...code];
      updatedCode[index] = value;
      setCode(updatedCode);

      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode.length === 4) {
      console.log("Submitted code:", enteredCode);
      navigate('/set-password');
    } else {
      alert('Please enter the 4-digit code.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <div className={styles.toggleContainer}>
          <div
            className={`${styles.toggleOption} ${selectedRole === 'doctor' ? styles.selected : styles.unselected}`}
            onClick={() => setSelectedRole('doctor')}
          >
            Doctor <FontAwesomeIcon icon={faUserDoctor} style={{ marginLeft: '8px' }} />
          </div>
          <div
            className={`${styles.toggleOption} ${selectedRole === 'patient' ? styles.selected : styles.unselected}`}
            onClick={() => {
              setSelectedRole('patient');
              setTimeout(() => navigate('/patient-signup'), 300);
            }}
          >
            Patient <FontAwesomeIcon icon={faUserInjured} style={{ marginLeft: '8px' }} />
          </div>
        </div>

        <button className={styles.backLink} onClick={() => navigate('/login')}>
          ← Back to login
        </button>

        <h1>Verify Code</h1>
        <p>An authentication code has been sent to your email.</p>

        <div className={styles.codeInputs}>
          {code.map((char, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={char}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className={styles.codeInput}
            />
          ))}
        </div>

        <div className={styles.timer}>
          <span className={styles.time}>01:00</span>
          <span className={styles.resendText}>
            Didn’t receive a code? <a href="#" className={styles.resendLink}>Resend</a>
          </span>
        </div>

        <button onClick={handleVerify} className={styles.verifyBtn}>
          Verify
        </button>
      </div>

      <div className={styles.imageSection}>
        <img src={doctorImg} alt="Verification Illustration" />
      </div>
    </div>
  );
};

export default VerifyCode;
