import React, { useState, useEffect } from "react";
import styles from "./drPatientDashboard.module.css";
import DrSidebar from "../../../components/drsidebar/DoctorSB";
import DrNavbar from "../../../components/DrNavbar/DrNavbar";
import { FaEdit } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { privateInstance } from "../../../services/api";
import { DOCTOR } from "../../../services/api";
import { useAuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";

const PatientDetails = () => {
  const { patientId } = useParams();
  const { userId } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(null);

  // Fetch patient details
  useEffect(() => {
    const loadPatientDetails = async () => {
      if (!userId || !patientId) return;

      setIsLoading(true);
      try {
        const response = await privateInstance.get(
          DOCTOR.Get_Specific_Patient(userId, patientId)
        );
        if (response.data && response.data.status === "success") {
          setPatient(response.data.data);
          setEditedPatient(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load patient details:", error);
        setError(error.response?.data?.message || "Failed to load patient details");
        toast.error("Failed to load patient details");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientDetails();
  }, [userId, patientId]);

  const handleUpdatePatient = async () => {
    if (!userId || !patientId) return;

    try {
      const response = await privateInstance.put(
        DOCTOR.Update_Patient(userId, patientId),
        editedPatient
      );

      if (response.data && response.data.status === "success") {
        setPatient(response.data.data);
        setIsEditing(false);
        toast.success("Patient updated successfully");
      }
    } catch (error) {
      console.error("Failed to update patient:", error);
      toast.error(error.response?.data?.message || "Failed to update patient");
    }
  };

  const handleDeletePatient = async () => {
    if (!userId || !patientId) return;

    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await privateInstance.delete(
          DOCTOR.Delete_Patient(userId, patientId)
        );

        if (response.data && response.data.status === "success") {
          toast.success("Patient deleted successfully");
          navigate("/dr-dashboard");
        }
      } catch (error) {
        console.error("Failed to delete patient:", error);
        toast.error(error.response?.data?.message || "Failed to delete patient");
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setEditedPatient(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setEditedPatient(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading patient details...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!patient) {
    return <div className={styles.error}>Patient not found</div>;
  }

  return (
    <div className={styles.content}>
      <div className={styles.profileCard}>
        <div className={styles.headerSection}>
          <div className={styles.profileInfo}>
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className={styles.profileImage}
            />
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPatient.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  className={styles.editInput}
                />
              ) : (
                <h2 className={styles.name}>{patient.patientName}</h2>
              )}
              <p className={styles.info}>{patient.email || "No email provided"}</p>
              <p className={styles.info}>{patient.phone || "No phone provided"}</p>
              <p className={styles.info}>#{patient._id}</p>
            </div>
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.editButton}
              onClick={() => {
                if (isEditing) {
                  handleUpdatePatient();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <FaEdit /> {isEditing ? "Save" : "Edit"}
            </button>
            <button
              className={styles.removeButton}
              onClick={handleDeletePatient}
            >
              Remove Patient
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={styles.activeTab}>Overview</button>
          <button className={styles.tab}>Medical History</button>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <p>Weight</p>
            {isEditing ? (
              <div className={styles.editGroup}>
                <input
                  type="number"
                  value={editedPatient.weight?.value}
                  onChange={(e) => handleNestedInputChange('weight', 'value', e.target.value)}
                  className={styles.editInput}
                />
                <select
                  value={editedPatient.weight?.unit}
                  onChange={(e) => handleNestedInputChange('weight', 'unit', e.target.value)}
                  className={styles.editSelect}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            ) : (
              <h3>{patient.weight?.value} {patient.weight?.unit}</h3>
            )}
          </div>
          <div className={styles.statBox}>
            <p>Height</p>
            {isEditing ? (
              <div className={styles.editGroup}>
                <input
                  type="number"
                  value={editedPatient.height?.value}
                  onChange={(e) => handleNestedInputChange('height', 'value', e.target.value)}
                  className={styles.editInput}
                />
                <select
                  value={editedPatient.height?.unit}
                  onChange={(e) => handleNestedInputChange('height', 'unit', e.target.value)}
                  className={styles.editSelect}
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            ) : (
              <h3>{patient.height?.value} {patient.height?.unit}</h3>
            )}
          </div>
          <div className={styles.statBox}>
            <p>O₂ Saturation</p>
            {isEditing ? (
              <input
                type="number"
                value={editedPatient.oxygenSaturation}
                onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                className={styles.editInput}
              />
            ) : (
              <h3>{patient.oxygenSaturation}%</h3>
            )}
          </div>
          <div className={styles.statBox}>
            <p>Blood Pressure</p>
            {isEditing ? (
              <div className={styles.editGroup}>
                <input
                  type="number"
                  value={editedPatient.bloodPressure?.systolic}
                  onChange={(e) => handleNestedInputChange('bloodPressure', 'systolic', e.target.value)}
                  className={styles.editInput}
                  placeholder="Systolic"
                />
                <span>/</span>
                <input
                  type="number"
                  value={editedPatient.bloodPressure?.diastolic}
                  onChange={(e) => handleNestedInputChange('bloodPressure', 'diastolic', e.target.value)}
                  className={styles.editInput}
                  placeholder="Diastolic"
                />
              </div>
            ) : (
              <h3>{patient.bloodPressure?.systolic}/{patient.bloodPressure?.diastolic} mmHg</h3>
            )}
          </div>
        </div>

        <div className={styles.sectionTitle}>Medications</div>
        {isEditing ? (
          <div className={styles.medicationEditSection}>
            {editedPatient.medications.map((medication, index) => (
              <div key={index} className={styles.medicationBox}>
                <div className={styles.editGroup}>
                  <input
                    type="text"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    placeholder="Medication Name"
                    className={styles.editInput}
                  />
                  <input
                    type="text"
                    value={medication.dose}
                    onChange={(e) => handleMedicationChange(index, 'dose', e.target.value)}
                    placeholder="Dose"
                    className={styles.editInput}
                  />
                  <input
                    type="datetime-local"
                    value={medication.time}
                    onChange={(e) => handleMedicationChange(index, 'time', e.target.value)}
                    className={styles.editInput}
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      setEditedPatient(prev => ({
                        ...prev,
                        medications: prev.medications.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              className={styles.addButton}
              onClick={() => {
                setEditedPatient(prev => ({
                  ...prev,
                  medications: [
                    ...prev.medications,
                    { name: '', dose: '', time: '' }
                  ]
                }));
              }}
            >
              + Add Medication
            </button>
          </div>
        ) : (
          <>
            {patient.medications && patient.medications.length > 0 ? (
              patient.medications.map((medication, index) => (
                <div key={index} className={styles.medicationBox}>
                  <h4>{medication.name}</h4>
                  <p>Dose: {medication.dose}</p>
                  <p>Time: {new Date(medication.time).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className={styles.medicationBox}>
                <p>No medications prescribed</p>
              </div>
            )}
          </>
        )}
      </div>


    </div>
  );
};

export default PatientDetails;
