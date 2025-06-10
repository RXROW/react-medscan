import React, { useState } from "react";
import styles from "../PatientProfile/PatientProfile.module.css";
import { FaUserMd } from "react-icons/fa";

const PatientProfile = () => {
  const [profile] = useState({
    firstName: "Ahmed",
    lastName: "Ali",
    status: "Single",
    email: "DRAhmedAli@gmail.com",
    country: "USA",
    dob: { day: "24", month: "05", year: "1997" },
    phone: { code: "+66", number: "5279562636" },
    city: "Minnesota",
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.avatar}>
                <FaUserMd size={50} />
              </div>
              <div className={styles.profileInfo}>
                <h2>
                  DR {profile.firstName} {profile.lastName}
                </h2>
                <div className={styles.rating}>★★★★★</div>
                <p>Male, 28</p>
              </div>
              <div className={styles.buttons}>
                <button className={styles.saveBtn}>Save</button>
                <button className={styles.deleteBtn}>Delete profile</button>
              </div>
            </div>

            <button className={styles.editProfileBtn}>Edit Profile ⚙️</button>

            <div className={styles.tabs}>
              <span className={styles.activeTab}>Personal Information</span>
              <span>Settings</span>
            </div>

            <form className={styles.form}>
              <div className={styles.row}>
                <div>
                  <label>First Name</label>
                  <input type="text" value={profile.firstName} readOnly />
                </div>
                <div>
                  <label>Last Name</label>
                  <input type="text" value={profile.lastName} readOnly />
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Status</label>
                  <select value={profile.status} disabled>
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>
                <div>
                  <label>Date of Birth</label>
                  <div className={styles.dob}>
                    <select value={profile.dob.day} disabled><option>24</option></select>
                    <select value={profile.dob.month} disabled><option>05</option></select>
                    <select value={profile.dob.year} disabled><option>1997</option></select>
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Email Address</label>
                  <input type="email" value={profile.email} readOnly />
                </div>
                <div>
                  <label>Phone Number</label>
                  <div className={styles.phone}>
                    <select value={profile.phone.code} disabled><option>+66</option></select>
                    <input type="text" value={profile.phone.number} readOnly />
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Country</label>
                  <select value={profile.country} disabled><option>USA</option></select>
                </div>
                <div>
                  <label>City</label>
                  <select value={profile.city} disabled><option>Minnesota</option></select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
