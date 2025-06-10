import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/images/landingPage/logo.png';
import { FaBell } from 'react-icons/fa';

const DoctorNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="MedScan Logo" />
      </div>

      <div className={styles.navCenter}>
        <Link to="/doctor/dashboard">Dashboard</Link>
        <Link to="/doctor/appointments">Appointments</Link>
        <Link to="/doctor/patients">Patients</Link>
      </div>

      <div className={styles.navRight}>
        <div className={styles.notificationWrapper}>
          <FaBell className={styles.notificationIcon} />
          <span className={styles.notificationBadge}>3</span>
        </div>
        <img 
          src="/images/doctor-avatar.jpg" 
          alt="Doctor" 
          className={styles.profileImage} 
        />
      </div>
    </nav>
  );
};

export default DoctorNavbar;