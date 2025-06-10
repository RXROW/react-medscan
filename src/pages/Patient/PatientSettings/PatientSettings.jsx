import React, { useState } from 'react';
import styles from '../PatientSettings/PatientSettings.module.css';
import PatientSB from '../../../components/patientsidebar/PatientSB';

const PatientSettings = () => {
  const [activeTab, setActiveTab] = useState('settings');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <div className={styles.tabContent}>Chat with MedScan Bot content goes here</div>;
      case 'patients':
        return <div className={styles.tabContent}>Patients list content goes here</div>;
      case 'settings':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Other Options</h2>
            <div className={styles.options}>
              <label className={styles.option}>
                <input type="checkbox" /> Name
              </label>
              <label className={styles.option}>
                <input type="checkbox" defaultChecked /> Identity
              </label>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Settings</h2>
              <h3 className={styles.subtitle}>PERSONAL SETTINGS</h3>

              <div className={styles.profileSection}>
                <h4 className={styles.tableTitle}>PROFILE DETAILS</h4>
                <table className={styles.profileTable}>
                  <tbody>
                    <tr>
                      <td>First Name</td>
                      <td>Ahmed</td>
                      <td>Last Name</td>
                      <td>All</td>
                    </tr>
                    <tr>
                      <td>Country</td>
                      <td>Please Select</td>
                      <td>Phone Number</td>
                      <td>+20 1011 511 311</td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td>Please select</td>
                      <td>Specialty</td>
                      <td>Please select</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.privacySection}>
                <h3 className={styles.subtitle}>PRIVACY & SECURITY</h3>
                <table className={styles.privacyTable}>
                  <tbody>
                    <tr>
                      <td>EMAIL ADDRESS</td>
                      <td>DR&hmedAll@gmail.com</td>
                      <td>EoR</td>
                      <td></td>
                      <td>PASSWORD</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.socialSection}>
                <h3 className={styles.subtitle}>SOCIAL ACCOUNTS</h3>
                <table className={styles.socialTable}>
                  <tbody>
                    <tr>
                      <td>FACEBOOK</td>
                      <td>Not connected</td>
                      <td><button className={styles.connectBtn}>Connect</button></td>
                      <td>GOOGLE</td>
                      <td>Not connected</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return <div className={styles.tabContent}>Select a tab</div>;
    }
  };

  return ( 
        <div className={styles.mainContent}>
          {/* <SettingsNav /> */}

          <h1 className={styles.title}>MEDSCAN</h1>

          <div className={styles.navTabs}>
            <button
              className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat with MedScan Bot
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'patients' ? styles.active : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              Patients list
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {renderContent()}
        </div>
   
    
  );
};

export default PatientSettings;
