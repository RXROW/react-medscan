import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/images/landingPage/logo.png';
import { FaBell } from 'react-icons/fa';

const PatientNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="MedScan Logo" />
      </div>

      <div className={styles.navCenter}>
        <Link to="/patient/dashboard">Dashboard</Link>
        <Link to="/patient/appointments">Appointments</Link>
        <Link to="/patient/doctors">Doctors</Link>
      </div>

      <div className={styles.navRight}>
        <div className={styles.notificationWrapper}>
          <FaBell className={styles.notificationIcon} />
          <span className={styles.notificationBadge}>2</span>
        </div>
        <img 
          src="/images/patient-avatar.jpg" 
          alt="Patient" 
          className={styles.profileImage} 
        />
      </div>
    </nav>
  );
};

export default PatientNavbar;