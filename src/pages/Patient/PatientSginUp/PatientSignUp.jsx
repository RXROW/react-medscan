import React, { useState } from 'react';
import paImg from "../../../assets/images/patientImages/patient.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor, faUserInjured, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import google from "../../../assets/images/DrSignUp/google.png";
import { useNavigate } from 'react-router-dom';
import { publicInstance } from '../../../services/api';
import { AUTH_URLS } from '../../../services/api';
import { useAuthContext } from '../../../Context/AuthContext';

import { toast } from 'react-hot-toast';

import styles from '../../../components/ShardStyles/PatientLogin.module.css';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { saveLoginData } = useAuthContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
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
      const response = await publicInstance.post(AUTH_URLS.signup, {
        ...formData,
        role: 'patient'
      });

      localStorage.setItem('token', response?.data?.data?.token);
      saveLoginData();
      toast.success(response?.data?.message || 'Signup successful');
      navigate('/');
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during signup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <div className={styles.toggleContainer}>
          <div className={`${styles.toggleOption} ${styles.selected}`}>
            Patient <FontAwesomeIcon icon={faUserInjured} style={{ marginLeft: "8px" }} />
          </div>
          <div
            className={`${styles.toggleOption} ${styles.unselected}`}
            onClick={() => navigate('/signup')}
          >
            Doctor <FontAwesomeIcon icon={faUserDoctor} style={{ marginLeft: "8px" }} />
          </div>
        </div>

        <div className={styles.welcomeText}>Welcome!</div>
        <div className={styles.headline}>Check your sign up and start managing your account</div>

        <a href="#" className={styles.googleLoginButton}>
          <img src={google} alt="Google Logo" />
          Sign up with Google
        </a>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <div className={styles.text}>Or use Email</div>
          <div className={styles.line}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Username:</label>
          <div className={styles.inputField}>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && <p className={styles.error}>{errors.name}</p>}

          <label htmlFor="email">Email:</label>
          <div className={styles.inputField}>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <label htmlFor="password">Password:</label>
          <div className={styles.inputField}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className={styles.toggleVisibility}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          <button type="submit" className={styles.continueButton} disabled={isLoading}>
            {isLoading ? 'Signing Up...' : <>START <span>→</span></>}
          </button>
        </form>

        <div className={styles.footerText}>
          By signing up, you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>
        </div>

        <div className={styles.loginRedirect}>
          <p>Already a Member?</p>
          <a onClick={() => navigate("/patient-login")}>LOG IN</a>
        </div>
      </div>

      <div className={styles.imageSection}>
        <img src={paImg} alt="patient" />
      </div>
    </div>
  );
}

