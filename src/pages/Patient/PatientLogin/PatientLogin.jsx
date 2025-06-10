import React, { useState } from 'react';
import paImg from "../../../assets/images/patientImages/patient.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor, faUserInjured, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import google from "../../../assets/images/DrSignUp/google.png";
import { publicInstance } from '../../../services/api';
import { AUTH_URLS } from '../../../services/api';
import { useAuthContext } from '../../../Context/AuthContext';
import { toast } from 'react-hot-toast';

import styles from '../../../components/ShardStyles/PatientLogin.module.css';

export default function PatientLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { saveLoginData } = useAuthContext();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await publicInstance.post(AUTH_URLS.login, {
        ...formData,
        role: 'patient'
      });

      console.log('Login response:', response.data); // Debug log

      if (response?.data?.message?.token) {
        localStorage.setItem('token', response.data.message.token);
        saveLoginData();
        toast.success('Login successful');
        navigate('/patient-chatbot');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/patient-forgot-password');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <div className={styles.toggleContainer}>
          <div className={`${styles.toggleOption} ${styles.selected}`}>
            Patient
            <FontAwesomeIcon icon={faUserInjured} style={{ marginLeft: "8px" }} />
          </div>
          <div
            className={`${styles.toggleOption} ${styles.unselected}`}
            onClick={() => navigate('/login')}
          >
            Doctor
            <FontAwesomeIcon icon={faUserDoctor} style={{ marginLeft: "8px" }} />
          </div>
        </div>

        <div className={styles.welcomeText}>WELCOME BACK 👋</div>
        <div className={styles.headline}>Continue to your account</div>

        <a href="#" className={styles.googleLoginButton}>
          <img src={google} alt="Google Logo" />
          Login with Google
        </a>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <div className={styles.text}>Or use Email</div>
          <div className={styles.line}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <div className={styles.inputField}>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className={styles.errorText}>{errors.email}</div>}
          </div>

          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.inputField}>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className={styles.toggleVisibility}
                onClick={() => setShowPassword(prev => !prev)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.password && <div className={styles.errorText}>{errors.password}</div>}
          </div>

          <div className={styles.options}>
            <label>
              <input type="checkbox" id="remember-me" /> Remember me
            </label>
            <a
              href="#"
              className={styles.forgotPassword}
              onClick={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
            >
              Forgot Password?
            </a>
          </div>

          <button type="submit" className={styles.continueButton} disabled={isLoading}>
            {isLoading ? "LOADING..." : <>CONTINUE <span>→</span></>}
          </button>
        </form>

        <div className={styles.footerText}>
          Are you a Newbie?{' '}
          <a href="#" onClick={() => navigate('/patient-signup')}>
            GET STARTED
          </a>
        </div>
      </div>

      <div className={styles.imageSection}>
        <img src={paImg} alt="patient" />
      </div>
    </div>
  );
}
