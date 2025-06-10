import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { publicInstance } from '../../../services/api';
import { AUTH_URLS } from '../../../services/api';
import { useAuthContext } from '../../../Context/AuthContext';
import { toast } from 'react-hot-toast';

import doctorImg from "../../../assets/images/DrSignUp/DR.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor, faUserInjured, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import google from "../../../assets/images/DrSignUp/google.png";
import styles from '../../../components/ShardStyles/PatientLogin.module.css';

const DoctorSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("doctor");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const { saveLoginData } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
        role: selectedRole
      });

      if (response?.data?.status === "success") {
        // Store the token
        localStorage.setItem('token', response.data.data.token);

        // Update auth context
        saveLoginData();

        // Show OTP input
        setShowOTPInput(true);
        toast.success(response.data.message || 'OTP sent to your email');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during signup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await publicInstance.post(AUTH_URLS.verifyEmail, {
        email: formData.email,
        OTP: otp
      });

      if (response?.data?.status === "success") {
        toast.success('Email verified successfully!');
        // Navigate based on role
        if (selectedRole === 'doctor') {
          navigate('/doctor-chatbot');
        } else {
          navigate('/patient-chatbot');
        }
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during OTP verification');
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
            className={`${styles.toggleOption} ${selectedRole === "doctor" ? styles.selected : styles.unselected
              }`}
            onClick={() => setSelectedRole("doctor")}
          >
            Doctor
            <FontAwesomeIcon icon={faUserDoctor} style={{ marginLeft: "8px" }} />
          </div>
          <div
            className={`${styles.toggleOption} ${selectedRole === "patient" ? styles.selected : styles.unselected
              }`}
            onClick={() => {
              setSelectedRole("patient");
              setTimeout(() => navigate("/patient-signup"), 300);
            }}
          >
            Patient
            <FontAwesomeIcon icon={faUserInjured} style={{ marginLeft: "8px" }} />
          </div>
        </div>

        <h2 className={styles.welcomeText}>Welcome!</h2>
        <p className={styles.headline}>Check your sign up and start managing your account</p>

        <button className={styles.googleLoginButton}>
          <img src={google} alt="Google" />
          Sign up with Google
        </button>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <span className={styles.text}>Or use Email</span>
          <div className={styles.line}></div>
        </div>

        {!showOTPInput ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Username:</label>
            <div className={styles.inputField}>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <span
                className={styles.toggleVisibility}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.password && <p className={styles.error}>{errors.password}</p>}

            <button
              type="submit"
              className={styles.continueButton}
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'START →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit}>
            <label htmlFor="otp">Enter OTP:</label>
            <div className={styles.inputField}>
              <input
                id="otp"
                type="text"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={handleOTPChange}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={styles.continueButton}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'VERIFY OTP →'}
            </button>
          </form>
        )}

        <p className={styles.footerText}>
          By Signing up, you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>.
        </p>

        <div className={styles.loginRedirect}>
          <p>Already a Member?</p>
          <a href="#" onClick={() => navigate("/patient-login")}>LOG IN</a>
        </div>
      </div>

      <div className={styles.imageSection}>
        <img src={doctorImg} alt="Doctor Signup Visual" />
      </div>
    </div>
  );
};

export default DoctorSignUp;
