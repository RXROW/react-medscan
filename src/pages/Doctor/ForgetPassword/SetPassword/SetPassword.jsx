import React, { useState } from "react";
import styles from "./SetPassword.module.css";
import doctorImg from "../../../../assets/images/DrSignUp/DR.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserDoctor,
  faUserInjured,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";

const SetPassword = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("doctor");

  const [passwordVisible, setPasswordVisible] = useState({
    create: false,
    reenter: false,
  });

  const [passwords, setPasswords] = useState({
    create: "",
    reenter: "",
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwords.create !== passwords.reenter) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.success("Password successfully set!", {
      onClose: () => navigate("/login" )
    });
  };

  const passwordStrength = zxcvbn(passwords.create).score;
  const getStrengthText = () => {
    return ["veryWeak", "weak", "fair", "good", "strong"][passwordStrength];
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.toggleContainer}>
          <button
            type="button"
            className={`${styles.toggleOption} ${
              selectedRole === "doctor" ? styles.selected : styles.unselected
            }`}
            onClick={() => setSelectedRole("doctor")}
          >
            Doctor <FontAwesomeIcon icon={faUserDoctor} />
          </button>
          <button
            type="button"
            className={`${styles.toggleOption} ${
              selectedRole === "patient" ? styles.selected : styles.unselected
            }`}
            onClick={() => setSelectedRole("patient")}
          >
            Patient <FontAwesomeIcon icon={faUserInjured} />
          </button>
        </div>

        <h1 className={styles.title}>Set a new password</h1>
        <p className={styles.description}>
          Your previous password has been reset. Please set a new password for your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.passwordField}>
            <label htmlFor="create">Create Password</label>
            <input
              type={passwordVisible.create ? "text" : "password"}
              id="create"
              value={passwords.create}
              onChange={handleChange}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => togglePasswordVisibility("create")}
            >
              <FontAwesomeIcon icon={passwordVisible.create ? faEyeSlash : faEye} />
            </span>
            {passwords.create && (
              <p className={`${styles.strengthText} ${styles[getStrengthText()]}`}>
                Strength: {getStrengthText()}
              </p>
            )}
          </div>

          <div className={styles.passwordField}>
            <label htmlFor="reenter">Re-enter Password</label>
            <input
              type={passwordVisible.reenter ? "text" : "password"}
              id="reenter"
              value={passwords.reenter}
              onChange={handleChange}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => togglePasswordVisibility("reenter")}
            >
              <FontAwesomeIcon icon={passwordVisible.reenter ? faEyeSlash : faEye} />
            </span>
            {passwords.reenter &&
              passwords.create !== passwords.reenter && (
                <p className={styles.errorText}>Passwords do not match.</p>
              )}
          </div>

          <button type="submit" className={styles.setPasswordBtn}>
            Set password
          </button>
        </form>
      </div>

      <div className={styles.imageSection}>
        <img src={doctorImg} alt="Doctor Illustration" />
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default SetPassword;