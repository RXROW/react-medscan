import React, { useState } from "react";
import styles from "../MedicalHistory/MedicalHistory.module.css";
import { LuFileSearch2 } from "react-icons/lu";
import { IoAdd } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";
import { FaHeartbeat, FaTemperatureHigh, FaTint, FaHeart } from "react-icons/fa";

const defaultPatientData = {
  name: "Ahmed Hossam",
  age: 26,
  profileImageUrl: "https://via.placeholder.com/80",
  gender: "Male",
  bloodType: "O+ (Positive)",
  allergies: "Milk, Penicillin",
  diseases: "Osteoarthritis, Diabetes",
  height: "1.70m",
  weight: "95 Kg",
  patientID: "208855112",
  lastVisit: "25th October 2024",
  bloodSugar: { value: 80, unit: "mg / dL", status: "Normal" },
  heartRate: { value: 98, unit: "bpm", status: "Normal" },
  bloodPressure: { value: "102 /72", unit: "mmHg", status: "Normal" },
  bodyTemperature: { value: 37.5, unit: "c", status: "Normal" },
  testReports: [
    {
      id: 1,
      title: "UV Invasive Ultrasound",
      time: "02:00 PM",
      description: null,
    },
    {
      id: 2,
      title: "Nerve Disorder",
      time: null,
      description:
        "A small nerve in the left-mid section of the neck has shown swollen properties. A brain scan is suggested",
    },
  ],
  prescriptions: [
    {
      id: 1,
      name: "Heart Disease",
      date: "25th October 2024",
      duration: "3 Months",
      iconType: "heart",
    },
    {
      id: 2,
      name: "Diabetes",
      date: "13th January 2024",
      duration: "9 Months",
      iconType: "diabetes",
    },
  ],
};

const MedicalHistory = ({ patientData = defaultPatientData }) => {
  const {
    name,
    age,
    gender,
    bloodType,
    allergies,
    diseases,
    height,
    weight,
    patientID,
    lastVisit,
    bloodSugar,
    heartRate,
    bloodPressure,
    bodyTemperature,
    testReports,
  } = patientData;

  const [prescriptions, setPrescriptions] = useState(patientData.prescriptions);
  const imageToShow = patientData.profileImageUrl || "https://via.placeholder.com/80";

  const handleAddPrescription = () => {
    const newPrescription = {
      id: prescriptions.length + 1,
      name: "New Prescription",
      date: new Date().toLocaleDateString(),
      duration: "1 Month",
      iconType: "default",
    };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  return (
    <div style={{ display: "flex" }}>

      <div style={{ flex: 1 }}>

        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.leftColumn}>
              <div className={styles.userProfileCard}>
                <div
                  className={styles.profileImage}
                  style={{ backgroundImage: `url(${imageToShow})` }}
                ></div>
                <div className={styles.userName}>{name}</div>
                <div className={styles.userAge}>Age: {age}</div>
                <button className={styles.updateButton}>Update</button>
              </div>

              <div className={styles.informationSection}>
                <h3>Information:</h3>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Gender:</span>
                  <span className={styles.infoValue}>{gender}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Blood type:</span>
                  <span className={styles.infoValue}>{bloodType}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Allergies:</span>
                  <span className={styles.infoValue}>{allergies}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Diseases:</span>
                  <span className={styles.infoValue}>{diseases}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Height:</span>
                  <span className={styles.infoValue}>{height}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Weight:</span>
                  <span className={styles.infoValue}>{weight}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Patient ID:</span>
                  <span className={styles.infoValue}>{patientID}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Last visit:</span>
                  <span className={styles.infoValue}>{lastVisit}</span>
                </div>
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.metricsGrid}>
                {/* Metrics */}
                <div className={`${styles.metricCard} ${styles.bloodSugar}`}>
                  <div className={styles.metricIcon}>
                    <FaTint size={24} />
                  </div>
                  <div className={styles.metricTitle}>Blood Sugar</div>
                  <div className={styles.metricValue}>
                    {bloodSugar.value}{" "}
                    <span className={styles.metricUnit}>{bloodSugar.unit}</span>
                  </div>
                  <div className={styles.metricStatus}>{bloodSugar.status}</div>
                </div>

                <div className={`${styles.metricCard} ${styles.heartRate}`}>
                  <div className={styles.metricIcon}>
                    <FaHeartbeat size={24} />
                  </div>
                  <div className={styles.metricTitle}>Heart Rate</div>
                  <div className={styles.metricValue}>
                    {heartRate.value}{" "}
                    <span className={styles.metricUnit}>{heartRate.unit}</span>
                  </div>
                  <div className={styles.metricStatus}>{heartRate.status}</div>
                </div>

                <div className={`${styles.metricCard} ${styles.bloodPressure}`}>
                  <div className={styles.metricIcon}>
                    <FaHeart size={24} />
                  </div>
                  <div className={styles.metricTitle}>Blood Pressure</div>
                  <div className={styles.metricValue}>
                    {bloodPressure.value}{" "}
                    <span className={styles.metricUnit}>
                      {bloodPressure.unit}
                    </span>
                  </div>
                  <div className={styles.metricStatus}>
                    {bloodPressure.status}
                  </div>
                </div>

                <div className={`${styles.metricCard} ${styles.bodyTemperature}`}>
                  <div className={styles.metricIcon}>
                    <FaTemperatureHigh size={24} />
                  </div>
                  <div className={styles.metricTitle}>Body Temperature</div>
                  <div className={styles.metricValue}>
                    {bodyTemperature.value}{" "}
                    <span className={styles.metricUnit}>
                      {bodyTemperature.unit}
                    </span>
                  </div>
                  <div className={styles.metricStatus}>
                    {bodyTemperature.status}
                  </div>
                </div>
              </div>

              <div className={styles.testReportsSection}>
                <h3>
                  <LuFileSearch2 className={styles.testReportIcon} />
                  Test Reports
                </h3>

                <div className={styles.testReportsCombinedCard}>
                  {testReports.map((report) => (
                    <div key={report.id} className={styles.testReportDetails}>
                      <div className={styles.testReportTitle}>{report.title}</div>
                      {report.time && (
                        <div className={styles.testReportTime}>{report.time}</div>
                      )}
                      {report.description && (
                        <div className={styles.testReportDescription}>
                          {report.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>



              <div className={styles.prescriptionsSection}>
                <h3>Prescriptions</h3>
                <button
                  className={styles.addPrescriptionButton}
                  onClick={handleAddPrescription}
                >
                  <IoAdd style={{ marginRight: "5px" }} />
                  Add Prescription
                </button>

                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className={styles.prescriptionItem}
                  >
                    <div className={styles.prescriptionIcon}>
                      <MdAssignmentAdd />
                    </div>
                    <div className={styles.prescriptionName}>
                      {prescription.name}
                    </div>
                    <div className={styles.prescriptionDate}>
                      {prescription.date}
                    </div>
                    <div className={styles.prescriptionDuration}>
                      {prescription.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
