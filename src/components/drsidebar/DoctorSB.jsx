import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaUserFriends, FaUserMd } from "react-icons/fa";
import { IoSettingsOutline, IoExitOutline, IoMenuOutline } from "react-icons/io5";
import drImg from "../../assets/images/drImages/profil.png";

import styles from "../drsidebar/DoctorSB.module.css";
import logo from "../../../public/logo.png";

const DrSidebar = ({ user = { avatar: '/default-avatar.png', name: 'Unknown User' } }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className={styles.mobileMenuButton} onClick={toggleSidebar}>
        <IoMenuOutline size={24} />
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
        onClick={closeSidebar}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <Link to={"/"}>

          <img src={logo} alt="MedScan Logo" className={styles.logo} />
        </Link>
        <p className={styles.section}>Sessions</p>

        <NavLink
          to="/doctor-chatbot"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.menuItemActive}` : styles.menuItem
          }
          onClick={closeSidebar}
        >
          <TfiCommentAlt className={styles.menuItemText} />
          <span className={styles.menuItemText }>Chat with MedScan </span>
        </NavLink>

        <NavLink
          to="/dr-dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.menuItemActive}` : styles.menuItem
          }
          onClick={closeSidebar}
        >
          <FaUserFriends className={styles.menuItemText} />
          <span className={styles.menuItemText}>Patients list</span>
        </NavLink>

        <hr className={styles.separator} />
        <p className={styles.section}>Other Options</p>

        <NavLink
          to="/dr-profile"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.menuItemActive}` : styles.menuItem
          }
          onClick={closeSidebar}
        >
          <FaUserMd className={styles.menuItemText} />
          <span className={styles.menuItemText}>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.menuItemActive}` : styles.menuItem
          }
          onClick={closeSidebar}
        >
          <IoSettingsOutline className={styles.menuItemText} />
          <span className={styles.menuItemText}>Settings</span>
        </NavLink>

        <div className={styles.profile}>
          <img src={drImg} alt="Dr Image" width={60}  />
          <span >@{user.name}</span>

          <NavLink to="/logout" onClick={closeSidebar}>
            <IoExitOutline className={styles.exitIcon} />
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default DrSidebar;
