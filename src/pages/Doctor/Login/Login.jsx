import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicInstance } from '../../../services/api';
import { AUTH_URLS } from '../../../services/api';
import { useAuthContext } from '../../../Context/AuthContext';
import { toast } from 'react-hot-toast';

import styles from '../../../components/ShardStyles/PatientLogin.module.css';
import doctorImg from '../../../assets/images/DrSignUp/DR.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor, faUserInjured } from "@fortawesome/free-solid-svg-icons";
import google from "../../../assets/images/DrSignUp/google.png";

const DoctorLogin = () => {
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { saveLoginData } = useAuthContext();
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    const forgotPath = selectedRole === 'doctor'
      ? '/doctor-forgot-password'
      : '/patient-forgot-password';
    navigate(forgotPath);
  };

  const goToPage = (url) => {
    navigate(url);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
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
        role: selectedRole
      });

      if (response?.data?.message?.token) {
        // Store the token
        localStorage.setItem('token', response.data.message.token);

        // Update auth context
        saveLoginData();

        // Show success message
        toast.success('Login successful');

        // Navigate based on role
        if (selectedRole === 'doctor') {
          navigate('/doctor-chatbot');
        } else {
          navigate('/patient-chatbot');
        }
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <div className={styles.toggleContainer}>
          <div
            className={`${styles.toggleOption} ${selectedRole === "doctor" ? styles.selected : styles.unselected}`}
            onClick={() => setSelectedRole("doctor")}
          >
            Doctor
            <FontAwesomeIcon icon={faUserDoctor} style={{ marginLeft: "8px" }} />
          </div>
          <div
            className={`${styles.toggleOption} ${selectedRole === "patient" ? styles.selected : styles.unselected}`}
            onClick={() => {
              setSelectedRole("patient");
              setTimeout(() => navigate("/patient-login"), 300);
            }}
          >
            Patient
            <FontAwesomeIcon icon={faUserInjured} style={{ marginLeft: "8px" }} />
          </div>
        </div>

        <div className={styles.welcomeText}>WELCOME BACK 👋</div>
        <div className={styles.headline}>Continue to your Account.</div>

        <button className={styles.googleLoginButton}>
          <img src={google} alt="Google" />
          Log in with Google
        </button>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <div className={styles.text}>Or use Email</div>
          <div className={styles.line}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <div className={styles.inputField}>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <label htmlFor="password">Password:</label>
          <div className={styles.inputField}>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}

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

          <button
            type="submit"
            className={styles.continueButton}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'CONTINUE →'}
          </button>
        </form>

        <div className={styles.footerText}>
          Are you a Newbie?{' '}
          <a href="#" onClick={() => goToPage('/patient-signup')}>
            GET STARTED
          </a>
        </div>
      </div>

      <div className={styles.imageSection}>
        <img src={doctorImg} alt="Doctor login" />
      </div>
    </div>
  );
};

export default DoctorLogin;
