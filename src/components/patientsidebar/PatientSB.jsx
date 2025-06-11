import React from "react";
import { NavLink } from "react-router-dom";
import { FaHandHoldingMedical, FaUserFriends, FaRegUser } from "react-icons/fa";
import { LiaHistorySolid } from "react-icons/lia";
import { MdDocumentScanner } from "react-icons/md";
import { TfiCommentAlt } from "react-icons/tfi";
import { IoSettingsOutline, IoExitOutline } from "react-icons/io5";

import styles from "../patientsidebar/PatientSB.module.css";
import logo from "../../../public/logo.png";
import { useAuthContext } from "../../Context/AuthContext";

const PatientSidebar = () => {
  const { userRole } = useAuthContext();

  const renderPatientLinks = () => (
    <aside className={styles.sidebar}>
      <NavLink to="/">
        <img src={logo} alt="MedScan Logo" className={styles.logo} />
      </NavLink>

      <p className={styles.section}>Sessions</p>
      <NavLink
        to="/patient-chatbot"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <TfiCommentAlt />
        <span>Chat with MedScan</span>
      </NavLink>
      <NavLink
        to="/medical-advice"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <FaHandHoldingMedical />
        <span>Medical Advices</span>
      </NavLink>
      <NavLink
        to="/medical-history"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <LiaHistorySolid />
        <span>Medical History</span>
      </NavLink>
      <NavLink
        to="/doctor-recommendation"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <FaUserFriends />
        <span>Doctor Recommendation</span>
      </NavLink>
      <NavLink
        to="/patient-scans"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <MdDocumentScanner />
        <span>Patient Scans</span>
      </NavLink>

      <hr className={styles.separator} />
      <p className={styles.section}>Other Options</p>

      <NavLink
        to="/patient-profile"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <FaRegUser />
        <span>Profile</span>
      </NavLink>
      <NavLink
        to="/patient-settings"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <IoSettingsOutline />
        <span>Settings</span>
      </NavLink>

      <div className={styles.profile}>
        <NavLink to="/logout">
          <IoExitOutline className={styles.exitIcon} />
        </NavLink>
      </div>
    </aside>
  );

  const renderDoctorLinks = () => (
    <aside className={styles.sidebar}>
      <NavLink to="/">
        <img src={logo} alt="MedScan Logo" className={styles.logo} />
      </NavLink>

      <p className={styles.section}>Doctor Dashboard</p>
      <NavLink
        to="/doctor-chatbot"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <TfiCommentAlt />
        <span>Chat with MedScan</span>
      </NavLink>
      <NavLink
        to="/dr-dashboard"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <FaUserFriends />
        <span>Patients List</span>
      </NavLink>

      <hr className={styles.separator} />
      <p className={styles.section}>Other Options</p>

      <NavLink
        to="/dr-profile"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <FaRegUser />
        <span>Profile</span>
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? styles.menuItemActive : styles.menuItem
        }
      >
        <IoSettingsOutline />
        <span>Settings</span>
      </NavLink>

      <div className={styles.profile}>
        <NavLink to="/logout">
          <IoExitOutline className={styles.exitIcon} />
        </NavLink>
      </div>
    </aside>
  );

  return userRole === 'patient' ? renderPatientLinks() : renderDoctorLinks();
};

export default PatientSidebar;
