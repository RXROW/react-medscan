import React, { useState, useEffect } from "react";
import styles from "../DrProfile/DrProfile.module.css";
import drImg from "../../../assets/images/drimages/profil.png";
import { privateInstance } from "../../../services/api";
import { DOCTOR } from "../../../services/api";
import { useAuthContext } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DoctorProfile = () => {
  const { userId } = useAuthContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    status: "",
    email: "",
    country: "",
    dob: { day: "", month: "", year: "" },
    phone: { code: "", number: "" },
    city: "",
    specialization: "",
    experience: "",
    education: "",
    license: "",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const response = await privateInstance.get(DOCTOR.Update_Doctor_Profile(userId));
        if (response.data && response.data.status === "success") {
          const data = response.data.data;
          let dobDay = "";
          let dobMonth = "";
          let dobYear = "";

          if (data.dateOfBirth) {
            const dob = new Date(data.dateOfBirth);
            if (!isNaN(dob.getTime())) { // Check if date is valid
              dobDay = dob.getDate().toString().padStart(2, '0');
              dobMonth = (dob.getMonth() + 1).toString().padStart(2, '0');
              dobYear = dob.getFullYear().toString();
            }
          }

          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            status: data.Status || "", // Assuming API sends 'Status'
            email: data.email || "",
            country: data.country || "",
            dob: { day: dobDay, month: dobMonth, year: dobYear },
            phone: {
              code: data.phone?.substring(0, 3) || "",
              number: data.phone?.substring(3) || ""
            },
            city: data.city || "",
            specialization: data.specialty || "",
            experience: data.experience || "", // Initialize from data if available
            education: data.education || "",    // Initialize from data if available
            license: data.license || "",      // Initialize from data if available
          });
          setTempProfile(prevTempProfile => ({ // Use functional update for tempProfile
            ...prevTempProfile,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            status: data.Status || "", // Assuming API sends 'Status'
            email: data.email || "",
            country: data.country || "",
            dob: { day: dobDay, month: dobMonth, year: dobYear },
            phone: {
              code: data.phone?.substring(0, 3) || "",
              number: data.phone?.substring(3) || ""
            },
            city: data.city || "",
            specialization: data.specialty || "",
            experience: data.experience || "",
            education: data.education || "",
            license: data.license || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile({ ...profile });
  };

  const handleSave = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Validate DOB before creating Date object
      const { day, month, year } = tempProfile.dob;
      console.log('DOB values before new Date():', { day, month, year }); // Debugging log

      if (!day || !month || !year || isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
        toast.error("Please select a complete and valid date of birth.");
        setIsLoading(false);
        return;
      }

      const dateObject = new Date(`${year}-${month}-${day}`);
      console.log('Date object after creation:', dateObject); // Debugging log

      if (isNaN(dateObject.getTime())) {
        toast.error("Invalid date of birth provided. Please check the date.");
        setIsLoading(false);
        return;
      }
      const dateOfBirth = dateObject.toISOString();

      const profileData = {
        firstName: tempProfile.firstName,
        lastName: tempProfile.lastName,
        status: tempProfile.status,
        city: tempProfile.city,
        country: tempProfile.country,
        dateOfBirth,
        phone: tempProfile.phone.code + tempProfile.phone.number,
        email: tempProfile.email,
        specialty: tempProfile.specialization
      };

      const response = await privateInstance.put(
        DOCTOR.Update_Doctor_Profile(userId),
        profileData
      );

      if (response.data && response.data.status === "success") {
        setProfile(tempProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!userId) return;

    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        const response = await privateInstance.delete(
          DOCTOR.Delete_Doctor_Profile(userId)
        );

        if (response.data && response.data.status === "success") {
          toast.success("Profile deleted successfully");
          // Clear local storage and redirect to login
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to delete profile:", error);
        toast.error(error.response?.data?.message || "Failed to delete profile");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  return (
    <div className={styles.profileContainer}>
      {/* Profile Header Section */}
      <section className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarSection}>
            <img src={drImg} alt="Doctor" className={styles.avatar} />
            <div className={styles.rating}>★★★★★</div>
          </div>
          <div className={styles.basicInfo}>
            <h2>DR {profile.firstName} {profile.lastName}</h2>
            <p className={styles.specialization}>{profile.specialization}</p>
            <p className={styles.experience}>{profile.experience} Experience</p>
          </div>
        </div>
        <div className={styles.actionButtons}> {/* Temporary style for debugging button visibility */}
          {isEditing ? (
            <>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.editBtn}
                onClick={handleEdit}
                disabled={isLoading}
              >
                Edit Profile
              </button>
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Profile"}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Profile Content Section */}
      <div className={styles.profileContent}>
        {/* Navigation Tabs */}
        <div className={styles.tabs}>
          <span className={styles.activeTab}>Personal Information</span>
          <span>Professional Details</span>
          <span>Settings</span>
        </div>

        {/* Form Sections */}
        <div className={styles.formSections}>
          {/* Personal Information Section */}
          <section className={styles.formSection}>
            <h3>Personal Information</h3>
            <form className={styles.form}>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    value={isEditing ? tempProfile.firstName : profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={isEditing ? tempProfile.lastName : profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={isEditing ? tempProfile.status : profile.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <div className={styles.dob}>
                    <select
                      value={isEditing ? tempProfile.dob.day : profile.dob.day}
                      onChange={(e) => handleNestedChange('dob', 'day', e.target.value)}
                      disabled={!isEditing}
                    >
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={isEditing ? tempProfile.dob.month : profile.dob.month}
                      onChange={(e) => handleNestedChange('dob', 'month', e.target.value)}
                      disabled={!isEditing}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={isEditing ? tempProfile.dob.year : profile.dob.year}
                      onChange={(e) => handleNestedChange('dob', 'year', e.target.value)}
                      disabled={!isEditing}
                    >
                      {Array.from({ length: 50 }, (_, i) => (
                        <option key={i} value={String(1970 + i)}>
                          {1970 + i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={isEditing ? tempProfile.email : profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <div className={styles.phone}>
                    <select
                      value={isEditing ? tempProfile.phone.code : profile.phone.code}
                      onChange={(e) => handleNestedChange('phone', 'code', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option>+66</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                    <input
                      type="text"
                      value={isEditing ? tempProfile.phone.number : profile.phone.number}
                      onChange={(e) => handleNestedChange('phone', 'number', e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Country</label>
                  <select
                    value={isEditing ? tempProfile.country : profile.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option>USA</option>
                    <option>UK</option>
                    <option>Canada</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>City</label>
                  <select
                    value={isEditing ? tempProfile.city : profile.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option>Minnesota</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                  </select>
                </div>
              </div>
            </form>
          </section>

          {/* Professional Information Section */}
          <section className={styles.formSection}>
            <h3>Professional Information</h3>
            <form className={styles.form}>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Specialization</label>
                  <input
                    type="text"
                    value={isEditing ? tempProfile.specialization : profile.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Experience</label>
                  <input
                    type="text"
                    value={isEditing ? tempProfile.experience : profile.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Education</label>
                  <input
                    type="text"
                    value={isEditing ? tempProfile.education : profile.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>License Number</label>
                  <input
                    type="text"
                    value={isEditing ? tempProfile.license : profile.license}
                    onChange={(e) => handleChange('license', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
