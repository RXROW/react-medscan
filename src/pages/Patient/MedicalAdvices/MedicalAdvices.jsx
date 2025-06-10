import React, { useState, useEffect } from "react";
import styles from "../MedicalAdvices/MedicalAdvices.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { privateInstance, MEDICAL_ADVICES } from "../../../services/api";
import { useAuthContext } from "../../../Context/AuthContext";

const MedicalAdvices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  const { userId, authLoading } = useAuthContext();

  const [medicalAdvices, setMedicalAdvices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [noDoctorAvailable, setNoDoctorAvailable] = useState(false);

  useEffect(() => {
    const fetchMedicalAdvices = async () => {
      try {
        const response = await privateInstance.get(
          MEDICAL_ADVICES.Get_All_Medical_Advices(userId)
        );
        console.log("API Response Data:", response.data);

        if (response.data && Array.isArray(response.data.medicalAdvices)) {
          if (response.data.medicalAdvices.length === 0) {
            setNoDoctorAvailable(true);
          } else {
            setMedicalAdvices(response.data.medicalAdvices);
          }
        } else {
          setError("Invalid data format received for medical advices.");
          console.error("Expected medicalAdvices to be an array:", response.data);
        }
      } catch (err) {
        setError("Failed to load medical advices. Please check your network and API.");
        console.error("Error fetching medical advices:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) {
      setLoading(true);
      setError(null);
    } else if (userId) {
      fetchMedicalAdvices();
    } else {
      setError("Patient ID is missing. Please log in.");
      setLoading(false);
    }
  }, [userId, authLoading]);

  const handleCardClick = (advice) => {
    setSelectedAdvice(advice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAdvice(null);
  };

  const handleNoDoctorModalClose = () => {
    setNoDoctorAvailable(false);
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderSpinner}></div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (noDoctorAvailable) {
    return (
      <div className={styles.noDoctorModal}>
        <div className={styles.noDoctorContent}>
          <h2 className={styles.noDoctorTitle}>No Medical Advices Available</h2>
          <p className={styles.noDoctorMessage}>
            We couldn't find any medical advices for your condition at this time.
            Please check back later or consult with your healthcare provider.
          </p>
          <button className={styles.noDoctorButton} onClick={handleNoDoctorModalClose}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Medical Advices</h1>
          <p className={styles.introText}>
            Dear Ahmed Ali, these are some medical advices based on your health
            condition and the diseases you added.
          </p>
          <div className={styles.advicesList}>
            {medicalAdvices.map((advice, index) => (
              <div
                key={advice._id || index}
                className={styles.adviceCard}
                onClick={() => handleCardClick(advice)}
              >
                <div className={styles.adviceHeader}>
                  <h2 className={styles.adviceTitle}>
                    {index + 1}. {advice.title}
                  </h2>
                  <button className={styles.closeButton}>X</button>
                </div>
                <ul className={styles.adviceDetails}>
                  {(advice.content || '').split('\n').map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedAdvice && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedAdvice.title}</h2>
              <button onClick={handleCloseModal} className={styles.modalCloseButton}>X</button>
            </div>
            <div className={styles.modalBody}>
              {(selectedAdvice.content || '').split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAdvices;