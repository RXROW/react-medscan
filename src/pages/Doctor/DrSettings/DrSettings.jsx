import { useState } from 'react';

import styles from '../DrSettings/DrSettings.module.css';

const PatientSettings = () => {
  // Initialize profile state with initial values
  const [profile, setProfile] = useState({
    firstName: "Ahmed",
    lastName: "Hossam",
    country: "Egypt",
    phoneNumber: "+20 1011 511 311",
    city: "Cairo",
    zipCode: "12345",
    email: "Hossam55@gmail.com",
    // Password is usually handled differently, but keeping it for now
    password: "••••••••••",
    social: {
      facebook: "Not connected",
      google: "Not connected"
    }
  });

  // Generic handler for text inputs and select elements
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [id]: value
    }));
  };

  // Specific handler for social connections (if they were to change status)
  // For 'Connect' buttons, you'd likely trigger an OAuth flow
  const handleSocialConnect = (platform) => {
    // This is a placeholder. In a real app, you'd integrate with Facebook/Google APIs
    setProfile(prevProfile => ({
      ...prevProfile,
      social: {
        ...prevProfile.social,
        [platform]: prevProfile.social[platform] === "Connected" ? "Not connected" : "Connected"
      }
    }));
    alert(`Connecting to ${platform}! (This is a placeholder action)`);
  };

  // Placeholder for Save and Cancel functions
  const handleSave = () => {
    console.log("Profile Saved:", profile);
    alert("Profile changes saved!");
    // In a real app, you'd send this data to your backend API
  };

  const handleCancel = () => {
    // A more robust cancel would reload the original profile data
    console.log("Changes cancelled.");
    alert("Changes cancelled.");
    // For now, we'll just log. If you had an 'originalProfile' state, you'd revert to it here.
  };

  return (

    <div className={styles.mainContentArea}>


      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>PERSONAL SETTINGS</h2>
          <div className={styles.actionButtons}>
            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
            <button className={styles.saveButton} onClick={handleSave}>Save</button>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>PROFILE DETAILS</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              {/* Made editable, value from state, onChange updates state */}
              <input type="text" id="firstName" value={profile.firstName} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              {/* Made editable, value from state, onChange updates state */}
              <input type="text" id="lastName" value={profile.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="country">Country</label>
              {/* Made editable, value from state, onChange updates state */}
              <select id="country" value={profile.country} onChange={handleChange}>
                <option value="Egypt">Egypt</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option> {/* Added more options for realism */}
                <option value="Germany">Germany</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Phone Number</label>
              {/* Made editable, value from state, onChange updates state */}
              <input type="text" id="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              {/* Made editable, value from state, onChange updates state */}
              <select id="city" value={profile.city} onChange={handleChange}>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Giza">Giza</option> {/* Added more options */}
                <option value="Luxor">Luxor</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="zipCode">ZIP Code</label>
              {/* Made editable, value from state, onChange updates state */}
              <input type="text" id="zipCode" value={profile.zipCode} onChange={handleChange} />
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>PRIVACY & SECURITY</h2>
        <div className={styles.card}>
          <div className={styles.formRow}>
            <div className={styles.formGroupCompact}>
              <label>EMAIL ADDRESS</label>
              {/* Displaying from state */}
              <span>{profile.email}</span>
            </div>
            {/* Edit button for email/password would likely open a modal or navigate */}
            <button className={styles.editButton} onClick={() => alert('Edit Email functionality goes here!')}>Edit</button>
            <div className={styles.formGroupCompact}>
              <label>PASSWORD</label>
              {/* Displaying from state */}
              <span>{profile.password}</span>
            </div>
            {/* Edit button for email/password would likely open a modal or navigate */}
            <button className={styles.editButton} onClick={() => alert('Edit Password functionality goes here!')}>Edit</button>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>SOCIAL ACCOUNTS</h2>
        <div className={styles.card}>
          <div className={styles.formRow}>
            <div className={styles.formGroupCompact}>
              <label>FACEBOOK</label>
              {/* Displaying from state */}
              <span>{profile.social.facebook}</span>
            </div>
            {/* Connect button with dynamic action based on platform */}
            <button className={styles.connectButton} onClick={() => handleSocialConnect('facebook')}>
              {profile.social.facebook === "Connected" ? "Disconnect" : "Connect"}
            </button>
            <div className={styles.formGroupCompact}>
              <label>GOOGLE</label>
              {/* Displaying from state */}
              <span>{profile.social.google}</span>
            </div>
            {/* Connect button with dynamic action based on platform */}
            <button className={styles.connectButton} onClick={() => handleSocialConnect('google')}>
              {profile.social.google === "Connected" ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PatientSettings;