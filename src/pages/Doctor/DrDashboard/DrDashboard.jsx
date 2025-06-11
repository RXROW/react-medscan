import React, { useState, useEffect } from "react";
import styles from "../DrDashboard/DrDashboard.module.css";
import DrSidebar from "../../../components/drsidebar/DoctorSB";
import DrNavbar from "../../../components/DrNavbar/DrNavbar";
import { HiOutlineAdjustments } from "react-icons/hi";
import { MdArrowOutward, MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { privateInstance } from "../../../services/api";
import { DOCTOR } from "../../../services/api";
import { useAuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const { userId } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "name",
    sortOrder: "asc"
  });
  const [newPatient, setNewPatient] = useState({
    patientName: "",
    location: "",
    bloodGlucoseLevel: "",
    weight: {
      value: "",
      unit: "kg"
    },
    height: {
      value: "",
      unit: "cm"
    },
    oxygenSaturation: "",
    bodyTemperature: "",
    bloodPressure: {
      systolic: "",
      diastolic: ""
    },
    medications: [
      {
        name: "",
        dose: "",
        time: ""
      }
    ]
  });
  const navigate = useNavigate();

  // Function to fetch patients data
  const fetchPatients = async () => {
    if (!userId) {
      setError("Doctor ID is missing");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
     

      const response = await privateInstance.get(DOCTOR.Get_All_Patients_Of_Doctor(userId));

      if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
        setPatients(response.data.data);
      } else {
        setPatients([]);
        setError("No patients data received or invalid response format");
      }
    } catch (error) {
      console.error("Failed to load patients:", error);
      setPatients([]);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to load patients. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPatients();
  }, [userId]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Doctor ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      // Add artificial delay of 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate date fields before sending
      const validatedMedications = newPatient.medications.map(med => {
        let time = med.time;
        if (time) {
          const date = new Date(time);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid medication time format");
          }
          time = date.toISOString();
        }
        return {
          ...med,
          time
        };
      });

      const patientData = {
        patientName: newPatient.patientName,
        location: newPatient.location,
        bloodGlucoseLevel: newPatient.bloodGlucoseLevel,
        weight: {
          value: parseFloat(newPatient.weight.value) || 0,
          unit: newPatient.weight.unit
        },
        height: {
          value: parseFloat(newPatient.height.value) || 0,
          unit: newPatient.height.unit
        },
        oxygenSaturation: parseFloat(newPatient.oxygenSaturation) || 0,
        bodyTemperature: parseFloat(newPatient.bodyTemperature) || 0,
        bloodPressure: {
          systolic: parseInt(newPatient.bloodPressure.systolic) || 0,
          diastolic: parseInt(newPatient.bloodPressure.diastolic) || 0
        },
        medications: validatedMedications,
        doctor: userId
      };

      const response = await privateInstance.post(
        DOCTOR.Create_Patient_Of_Doctor(userId),
        patientData
      );

      if (response.data) {
        // Close modal and reset form
        setShowAddPatientModal(false);
        setNewPatient({
          patientName: "",
          location: "",
          bloodGlucoseLevel: "",
          weight: { value: "", unit: "kg" },
          height: { value: "", unit: "cm" },
          oxygenSaturation: "",
          bodyTemperature: "",
          bloodPressure: { systolic: "", diastolic: "" },
          medications: [{ name: "", dose: "", time: "" }]
        });
        setError(null);

        // Show success message
        toast.success('Patient added successfully');

        // Refresh the patients list
        await fetchPatients();
      }
    } catch (error) {
      console.error("Failed to add patient", error);
      toast.error(error.message || "Failed to add patient");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...newPatient.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setNewPatient({
      ...newPatient,
      medications: updatedMedications
    });
  };

  const addMedication = () => {
    setNewPatient({
      ...newPatient,
      medications: [
        ...newPatient.medications,
        { name: "", dose: "", time: "" }
      ]
    });
  };

  const removeMedication = (index) => {
    const updatedMedications = newPatient.medications.filter((_, i) => i !== index);
    setNewPatient({
      ...newPatient,
      medications: updatedMedications
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleString('en-US', options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await privateInstance.delete(
          DOCTOR.Delete_Patient(userId, patientId)
        );

        if (response.data && response.data.status === "success") {
          setPatients(patients.filter(p => p._id !== patientId));
          toast.success("Patient deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete patient:", error);
        toast.error(error.response?.data?.message || "Failed to delete patient");
      }
    }
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc"
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      sortBy: "name",
      sortOrder: "asc"
    });
  };

  const handleRowClick = (patientId) => {
    navigate(`/dr-patient-dashboard/${patientId}`);
  };

  const filteredAndSortedPatients = patients
    .filter(patient => {
      const searchTerm = filters.search.toLowerCase();
      const patientName = (patient?.patientName || "").toLowerCase();
      const location = (patient?.location || "").toLowerCase();

      return patientName.includes(searchTerm) || location.includes(searchTerm);
    })
    .sort((a, b) => {
      const aValue = (a[filters.sortBy] || "").toString().toLowerCase();
      const bValue = (b[filters.sortBy] || "").toString().toLowerCase();
      return filters.sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  return (
    <>
      <div className={styles.content}>
        <div className={styles.cardContainer}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.header}>
            <h3 className={styles.headerTitle}>
              Patients List
              <MdArrowOutward className={styles.arrowIcon} />
            </h3>

            <div className={styles.buttonGroup}>
              <button
                className={styles.addButton}
                onClick={() => setShowAddPatientModal(true)}
                disabled={!userId || isLoading}
              >
                <span>+ Add Patient</span>
              </button>
              <button
                className={styles.filterButton}
                onClick={() => setShowFilterModal(true)}
                disabled={isLoading}
              >
                <HiOutlineAdjustments />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Filter Modal */}
          {showFilterModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Filter Patients</h2>
                <div className={styles.filterForm}>
                  <input
                    type="text"
                    placeholder="Search by name or location"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className={styles.filterInput}
                  />
                  <div className={styles.sortOptions}>
                    <label>Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className={styles.filterSelect}
                    >
                      <option value="patientName">Name</option>
                      <option value="location">Location</option>
                      <option value="createdAt">Date</option>
                    </select>
                    <button
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        sortOrder: prev.sortOrder === "asc" ? "desc" : "asc"
                      }))}
                      className={styles.sortButton}
                    >
                      {filters.sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                  </div>
                  <div className={styles.modalButtons}>
                    <button
                      className={styles.resetButton}
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </button>
                    <button
                      className={styles.closeButton}
                      onClick={() => setShowFilterModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Patient Modal */}
          {showAddPatientModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Add New Patient</h2>
                <form onSubmit={handleAddPatient}>
                  <div className={styles.formSection}>
                    <h3>Basic Information</h3>
                    <input
                      type="text"
                      placeholder="Patient Name"
                      value={newPatient.patientName}
                      onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newPatient.location}
                      onChange={(e) => setNewPatient({ ...newPatient, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formSection}>
                    <h3>Vital Signs</h3>
                    <input
                      type="text"
                      placeholder="Blood Glucose Level (mg/dL)"
                      value={newPatient.bloodGlucoseLevel}
                      onChange={(e) => setNewPatient({ ...newPatient, bloodGlucoseLevel: e.target.value })}
                    />
                    <div className={styles.measurementGroup}>
                      <input
                        type="number"
                        placeholder="Weight"
                        value={newPatient.weight.value}
                        onChange={(e) => setNewPatient({
                          ...newPatient,
                          weight: { ...newPatient.weight, value: e.target.value }
                        })}
                      />
                      <select
                        value={newPatient.weight.unit}
                        onChange={(e) => setNewPatient({
                          ...newPatient,
                          weight: { ...newPatient.weight, unit: e.target.value }
                        })}
                      >
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                      </select>
                    </div>
                    <div className={styles.measurementGroup}>
                      <input
                        type="number"
                        placeholder="Height"
                        value={newPatient.height.value}
                        onChange={(e) => setNewPatient({
                          ...newPatient,
                          height: { ...newPatient.height, value: e.target.value }
                        })}
                      />
                      <select
                        value={newPatient.height.unit}
                        onChange={(e) => setNewPatient({
                          ...newPatient,
                          height: { ...newPatient.height, unit: e.target.value }
                        })}
                      >
                        <option value="cm">cm</option>
                        <option value="ft">ft</option>
                      </select>
                    </div>
                    <input
                      type="number"
                      placeholder="Oxygen Saturation (%)"
                      value={newPatient.oxygenSaturation}
                      onChange={(e) => setNewPatient({ ...newPatient, oxygenSaturation: e.target.value })}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Body Temperature (°C)"
                      value={newPatient.bodyTemperature}
                      onChange={(e) => setNewPatient({ ...newPatient, bodyTemperature: e.target.value })}
                    />
                    <div className={styles.bloodPressureGroup}>
                      <input
                        type="number"
                        placeholder="Systolic"
                        value={newPatient.bloodPressure.systolic}
                        onChange={(e) => setNewPatient({
                          ...newPatient,
                          bloodPressure: { ...newPatient.bloodPressure, systolic: e.target.value }
                        })}
                      />
                      <span>/</span>
                      <input
                        type="number"
                        placeholder="Diastolic"
                        value={newPatient.bloodPressure.diastolic}
                        onChange={(e) => setNewPatient({
                          ...newPatient,
                          bloodPressure: { ...newPatient.bloodPressure, diastolic: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h3>Medications</h3>
                    {newPatient.medications.map((medication, index) => (
                      <div key={`medication-${index}`} className={styles.medicationGroup}>
                        <input
                          type="text"
                          placeholder="Medication Name"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Dose"
                          value={medication.dose}
                          onChange={(e) => handleMedicationChange(index, 'dose', e.target.value)}
                        />
                        <input
                          type="datetime-local"
                          value={medication.time}
                          onChange={(e) => handleMedicationChange(index, 'time', e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeMedication(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className={styles.addMedicationButton}
                      onClick={addMedication}
                    >
                      + Add Medication
                    </button>
                  </div>

                  <div className={styles.modalButtons}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={styles.submitButton}
                    >
                      {isLoading ? (
                        <div className={styles.buttonLoading}>
                          <div className={styles.buttonSpinner}></div>
                          <span>Adding Patient...</span>
                        </div>
                      ) : (
                        'Add Patient'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPatientModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className={styles.tableContainer}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading patients data...</p>
              </div>
            ) : (
              <table className={styles.patientTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th onClick={() => handleSort("patientName")}>
                      PATIENT NAME {filters.sortBy === "patientName" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                      JOINED DATE & TIME {filters.sortBy === "createdAt" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("location")}>
                      LOCATION {filters.sortBy === "location" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedPatients.length > 0 ? (
                    filteredAndSortedPatients.map((patient, index) => (
                      <tr
                        key={patient._id}
                        onClick={() => handleRowClick(patient._id)}
                        className={styles.tableRow}
                      >
                        <td>{index + 1}</td>
                        <td>{patient.patientName}</td>
                        <td>{formatDate(patient.createdAt)}</td>
                        <td>{patient.location}</td>
                        <td>
                          <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                            <button
                              className={styles.actionButton}
                              onClick={() => navigate(`/dr-patient-dashboard/${patient._id}`)}
                            >
                              <MdEdit /> Edit
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => handleDeletePatient(patient._id)}
                            >
                              <MdDelete /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        No patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;