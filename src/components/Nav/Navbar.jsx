import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/images/landingPage/logo.png';
import { useAuthContext } from '../../Context/AuthContext';
import { toast } from 'react-hot-toast';

const GuestNavbar = () => {
  const { userName, loginData, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Navbar - Current userName:', userName);
    console.log('Navbar - Current loginData:', loginData);
  }, [userName, loginData]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="MedScan Logo" />
      </div>

      <div className={styles.navCenter}>
        <a href="#home">Home</a>
        <a href="#How-to-use">How to use</a>
        <a href="#Who-it's-for">Who it's for</a>
        <a href="#Top-articles">Top articles</a>
      </div>

      <div className={styles.navRight}>
        {!loginData ? (
          <>
            <Link to="/login" className={styles.ctaButton}>Sign in</Link>
            <Link to="/signup" className={styles.ctaButton}>Sign up</Link>
          </>
        ) : (
          <div className={styles.userSection}>
            <span className={styles.welcomeText}>
              Welcome, {userName || loginData?.name || 'User'}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GuestNavbar;