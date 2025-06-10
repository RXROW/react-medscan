import React, { useState } from "react";
import styles from "../PatientProfile/PatientProfile.module.css";
import drImg from "../../../assets/images/drImages/profil.png";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { privateInstance } from "../../../services/api";
import { PATIENT_PROFILE } from "../../../services/api";
import { toast } from 'react-hot-toast';
import { useAuthContext } from "../../../Context/AuthContext";
import DiabetesImage from "../../../assets/images/patientImages/Diabetes.png";
import HypertensionImage from "../../../assets/images/patientImages/Hypertension.png";
import AsthmaImage from "../../../assets/images/patientImages/asthma.png";
import OtherImage from "../../../assets/images/patientImages/other.png";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { userId } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'medical'

  const [profile, setProfile] = useState({
    firstName: "Ahmed",
    lastName: "Ali",
    status: "Single",
    email: "DRAhmedAli@gmail.com",
    country: "USA",
    dob: { day: "24", month: "05", year: "1997" },
    phone: "5279562636",
    city: "Minnesota",
  });

  const [medicalFormData, setMedicalFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "No",
    age: "",
    weight: "",
    height: "",
    hasAllergies: "No",
    allergies: "",
    hasMedications: "No",
    medications: "",
    medicalConditions: "",
    otherCondition: "",
  });

  const [medicalErrors, setMedicalErrors] = useState({});
  const [isMedicalSubmitted, setIsMedicalSubmitted] = useState(false);

  const conditionImages = {
    Diabetes: DiabetesImage,
    Hypertension: HypertensionImage,
    Asthma: AsthmaImage,
    Other: OtherImage,
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateMedicalForm = () => {
    const newErrors = {};
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleMedicalInputChange = (e) => {
    const { name, value } = e.target;
    setMedicalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicalSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debug log

    try {
      console.log("Sending medical data:", medicalFormData); // Debug log
      const response = await privateInstance.put(
        PATIENT_PROFILE.Update_Patient_Profile(userId),
        {
          medicalInfo: {
            age: medicalFormData.age,
            weight: medicalFormData.weight,
            height: medicalFormData.height,
            hasAllergies: medicalFormData.hasAllergies,
            allergies: medicalFormData.allergies,
            hasMedications: medicalFormData.hasMedications,
            medications: medicalFormData.medications,
            medicalConditions: medicalFormData.medicalConditions,
            otherCondition: medicalFormData.otherCondition
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Medical information submitted successfully!");
        setIsMedicalSubmitted(true);
      }
    } catch (error) {
      console.error("Medical form submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit medical information");
    }
  };

  const resetMedicalForm = () => {
    setMedicalFormData({
      firstName: "",
      lastName: "",
      gender: "No",
      age: "",
      weight: "",
      height: "",
      hasAllergies: "No",
      allergies: "",
      hasMedications: "No",
      medications: "",
      medicalConditions: "",
      otherCondition: "",
    });
    setMedicalErrors({});
    setIsMedicalSubmitted(false);
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    try {
      const response = await privateInstance.put(
        PATIENT_PROFILE.Update_Patient_Profile(userId),
        profile
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        const response = await privateInstance.delete(
          PATIENT_PROFILE.Delete_Patient_Profile(userId)
        );
        if (response.status === 200) {
          toast.success("Profile deleted successfully");
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete profile");
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderToggle = (label, stateKey, inputName, inputPlaceholder) => (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <div
        className={`${styles.toggleSwitch} ${medicalFormData[stateKey] === "Yes" ? styles.active : ""}`}
        onClick={() =>
          setMedicalFormData((prev) => ({
            ...prev,
            [stateKey]: prev[stateKey] === "Yes" ? "No" : "Yes",
            [inputName]: prev[stateKey] === "Yes" ? "" : prev[inputName],
          }))
        }
      >
        <div className={styles.toggleCircle}></div>
        <span className={styles.toggleLabel}>
          {medicalFormData[stateKey] === "Yes" ? "Yes" : "No"}
        </span>
      </div>
      {medicalFormData[stateKey] === "Yes" && (
        <input
          type="text"
          name={inputName}
          value={medicalFormData[inputName]}
          onChange={handleMedicalInputChange}
          placeholder={inputPlaceholder}
          className={styles.inputField}
        />
      )}
    </div>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <img src={drImg} alt="Doctor" className={styles.avatar} />
              <div className={styles.profileInfo}>
                <h2>
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className={styles.rating}>★★★★★</div>
                <p>Male, 28</p>
              </div>
              <div className={styles.buttons}>
                {activeTab === 'personal' && isEditing ? (
                  <>
                    <button className={styles.saveBtn} onClick={handleUpdateProfile}>Save</button>
                    <button className={styles.secondaryButton} onClick={toggleEditMode}>Cancel</button>
                  </>
                ) : activeTab === 'personal' ? (
                  <button className={styles.editProfileBtn} onClick={toggleEditMode}>
                    Edit Profile <TbEdit />
                  </button>
                ) : null}
              </div>
            </div>

            <div className={styles.tabs}>
              <a
                href="#"
                className={`${styles.tab} ${activeTab === 'personal' ? styles.activeTab : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('personal'); setIsEditing(false); }}
              >
                Personal Information
              </a>
              <a
                href="#"
                className={`${styles.tab} ${activeTab === 'medical' ? styles.activeTab : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('medical'); setIsEditing(false); }}
              >
                Medical Info
              </a>
            </div>

            {activeTab === 'personal' && (
              <form className={styles.form}>
                <div className={styles.row}>
                  <div>
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <label>Status</label>
                    <select
                      name="status"
                      value={profile.status}
                      onChange={handleProfileInputChange}
                      disabled={!isEditing}
                    >
                      <option>Single</option>
                      <option>Married</option>
                    </select>
                  </div>
                  <div>
                    <label>Date of Birth</label>
                    <div className={styles.dob}>
                      <select
                        name="dob.day"
                        value={profile.dob.day}
                        onChange={handleProfileInputChange}
                        disabled={!isEditing}
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                      </select>
                      <select
                        name="dob.month"
                        value={profile.dob.month}
                        onChange={handleProfileInputChange}
                        disabled={!isEditing}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                      </select>
                      <select
                        name="dob.year"
                        value={profile.dob.year}
                        onChange={handleProfileInputChange}
                        disabled={!isEditing}
                      >
                        {Array.from({ length: 100 }, (_, i) => (
                          <option key={i}>{2024 - i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <label>Country</label>
                    <select
                      name="country"
                      value={profile.country}
                      onChange={handleProfileInputChange}
                      disabled={!isEditing}
                    >
                      <option>USA</option>
                      <option>UK</option>
                      <option>Canada</option>
                    </select>
                  </div>
                  <div>
                    <label>City</label>
                    <select
                      name="city"
                      value={profile.city}
                      onChange={handleProfileInputChange}
                      disabled={!isEditing}
                    >
                      <option>Minnesota</option>
                      <option>New York</option>
                      <option>Los Angeles</option>
                    </select>
                  </div>
                </div>

                {isEditing && (
                  <div className={styles.row}>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={handleDeleteProfile}
                    >
                      Delete Profile
                    </button>
                  </div>
                )}
              </form>
            )}

            {activeTab === 'medical' && (
              <form onSubmit={handleMedicalSubmit} className={styles.form}>


                <div className={styles.formRow}>

                  <div className={styles.formGroup}>
                    <label>Age</label>
                    <input
                      name="age"
                      value={medicalFormData.age}
                      onChange={handleMedicalInputChange}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Weight</label>
                    <input
                      name="weight"
                      value={medicalFormData.weight}
                      onChange={handleMedicalInputChange}
                      className={styles.inputField}
                      placeholder="kg"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Height</label>
                    <input
                      name="height"
                      value={medicalFormData.height}
                      onChange={handleMedicalInputChange}
                      className={styles.inputField}
                      placeholder="cm"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  {renderToggle(
                    "Do you have any allergies?",
                    "hasAllergies",
                    "allergies",
                    "If you have any allergies, mention it"
                  )}
                  {renderToggle(
                    "Do you take medications on a regular basis?",
                    "hasMedications",
                    "medications",
                    "If yes, mention it"
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroupFull}>
                    <label>Do you have any medical conditions?</label>
                    <div className={styles.conditionRow}>
                      {["Diabetes", "Hypertension", "Asthma", "Other"].map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          className={`${styles.conditionCard} ${medicalFormData.medicalConditions === cond ? styles.selected : ""}
                          `}
                          onClick={() =>
                            setMedicalFormData((prev) => ({
                              ...prev,
                              medicalConditions: cond,
                              otherCondition: cond === "Other" ? prev.otherCondition : "",
                            }))
                          }
                        >
                          <img
                            src={conditionImages[cond]}
                            alt={cond}
                            className={styles.conditionImage}
                          />
                          <span className={styles.conditionTitle}>{cond}</span>
                        </button>
                      ))}

                      <div className={styles.otherInputGroup}>
                        <label className={styles.otherLabel}>
                          If you choose other mention it?
                        </label>
                        <input
                          type="text"
                          name="otherCondition"
                          value={medicalFormData.otherCondition}
                          onChange={handleMedicalInputChange}
                          placeholder="ex: anti bodies"
                          className={styles.inputFieldSmall}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={resetMedicalForm}
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    onClick={handleMedicalSubmit}
                  >
                    Submit Medical Info
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
