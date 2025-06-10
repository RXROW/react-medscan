
import React, { useState } from 'react';
import styles from '../PatientScans/PatientScans.module.css'; 
import { IoCloudUploadOutline } from "react-icons/io5";

const PatientScans = () => {
  // State for file upload status (for demonstration)
  const [fileName, setFileName] = useState('No file chosen');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
      setUploadStatus('png, pdf, jpg accepted');
    }
  };

  const handleUpload = () => {
    // Simulate upload logic
    setUploadStatus('Uploading...');
    setTimeout(() => {
      setUploadStatus('Upload successful!');
    }, 1500);
  };


  return (
   <div className={styles.pageWrapper}>
 
  <div className={styles.mainContent}>
 
    <div className={styles.patientScans}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>My Scans</h1>
      </div>

      <div className={styles.cardsContainer}>
        {/* Card 1: Upload your scans */}
        <div className={styles.card}>
          <div className={styles.cardNumber}>1</div>
          <div className={styles.cardContent}>
            <div className={styles.iconContainer}>
              {/* Upload icon */}
            <IoCloudUploadOutline />

            
            </div>
            <h2 className={styles.cardTitle}>Upload your scans</h2>
            <p className={styles.fileStatus}>{fileName}</p>
            <p className={styles.fileAccepted}>{uploadStatus || 'png, pdf, jpg accepted'}</p>
            <input
              type="file"
              id="fileUpload"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept=".png,.pdf,.jpg,.jpeg"
            />
            <button
              className={styles.browseButton}
              onClick={() => document.getElementById('fileUpload').click()}
            >
              Browse
            </button>
            <div className={styles.actionButtons}>
              <button className={styles.uploadButton} onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>

        {/* Card 2: Analyze your scans */}
        <div className={styles.card}>
          <div className={styles.cardNumber}>2</div>
          <div className={styles.cardContent}>
            <div className={styles.iconContainer}>


            </div>
            <h2 className={styles.cardTitle}>Analyze your scans</h2>
            <p className={styles.waitingMessage}>Please waiting to get accurate results</p>
          </div>
        </div>

        {/* Card 3: Download results */}
        <div className={styles.card}>
          <div className={styles.cardNumber}>3</div>
          <div className={styles.cardContent}>
            <div className={styles.iconContainer}>
              {/* Download icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={styles.cardIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            <h2 className={styles.cardTitle}>Download results</h2>
            <p className={styles.downloadDescription}>You can download your scans results</p>
            <button className={styles.downloadButton}>Download</button>
          </div>
        </div>
      </div>
    </div>
        </div>
        </div>
  );
};

export default PatientScans;
