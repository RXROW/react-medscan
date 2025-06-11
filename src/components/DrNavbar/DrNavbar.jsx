// Navbar.jsx
import React, { useState, useEffect } from 'react';
import styles from '../DrNavbar/DrNavbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import drImg from "../../assets/images/drImages/profil.png";
import { useAuthContext } from '../../Context/AuthContext';
import { privateInstance } from '../../services/api';
import { DOCTOR } from '../../services/api';

const Navbar = () => {
  const { userId, userRole } = useAuthContext();
  const [doctorName, setDoctorName] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (!userId) return;
      try {
        const response = await privateInstance.get(DOCTOR.Update_Doctor_Profile(userId));
        if (response.data && response.data.status === "success") {
          const data = response.data.data;
          setDoctorName({
            firstName: data.firstName || "",
            lastName: data.lastName || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch doctor name:", error);
      }
    };

    fetchDoctorName();
  }, [userId]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.patientsLink}>Patients Overview</p>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search patients, reports, or appointments..."
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
            src={drImg}
            alt={`${doctorName.firstName} ${doctorName.lastName}` || "Doctor"}
          />
          <div className={styles.userDetails}>
            <span>{userRole === "doctor" ? `DR. ${doctorName.firstName} ${doctorName.lastName}` : `${doctorName.firstName} ${doctorName.lastName}`}</span>
            <span>{"General Practitioner"}</span>
          </div>
          <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
