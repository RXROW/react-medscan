// Navbar.jsx
import React, { useState, useEffect } from 'react';
import styles from '../DrNavbar/DrNavbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import drImg from "../../assets/images/drImages/profil.png";
import patientImg from "../../assets/images/drImages/profil.png";
import { useAuthContext } from '../../Context/AuthContext';
import { privateInstance } from '../../services/api';
import { DOCTOR, PATIENT_PROFILE } from '../../services/api';

const Navbar = () => {
  const { userId, userRole } = useAuthContext();
  const [userName, setUserName] = useState({ firstName: "", lastName: "" });
  const [userTitle, setUserTitle] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return;
      try {
        let response;
        if (userRole === "doctor") {
          response = await privateInstance.get(DOCTOR.Update_Doctor_Profile(userId));
          if (response.data && response.data.status === "success") {
            const data = response.data.data;
            setUserName({
              firstName: data.firstName || "",
              lastName: data.lastName || ""
            });
            setUserTitle(data.specialization || "General Practitioner");
          }
        } else if (userRole === "patient") {
          response = await privateInstance.get(PATIENT_PROFILE.Get_Patient_Profile(userId));
          if (response.data && response.data.status === "success") {
            const data = response.data.data;
            setUserName({
              firstName: data.firstName || "",
              lastName: data.lastName || ""
            });
            setUserTitle("Patient");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    };

    fetchUserName();
  }, [userId, userRole]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.patientsLink}>
          {userRole === "doctor" ? "Patients Overview" : "My Health Overview"}
        </p>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={userRole === "doctor" ?
              "Search patients, reports, or appointments..." :
              "Search doctors, appointments, or medical records..."}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.notificationIcon}>
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div className={styles.userInfo}>
          <img
            src={userRole === "doctor" ? drImg : patientImg}
            alt={`${userName.firstName} ${userName.lastName}` || userRole}
          />
          <div className={styles.userDetails}>
            <span>
              {userRole === "doctor"
                ? `DR. ${userName.firstName} ${userName.lastName}`
                : `${userName.firstName} ${userName.lastName}`
              }
            </span>
            <span>{userTitle}</span>
          </div>
          <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
