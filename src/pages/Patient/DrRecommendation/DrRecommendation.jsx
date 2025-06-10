import React, { useState, useEffect } from 'react';
import styles from '../DrRecommendation/DrRecommendation.module.css';
import { FaUserMd, FaStethoscope, FaTooth, FaBaby, FaFlask, FaDisease, FaBrain, FaHeartbeat, FaFemale, FaUserInjured, FaEye, FaExclamationCircle, FaTimes, FaMapMarkerAlt, FaClock, FaPhone, FaMoneyBillWave, FaStar, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { privateInstance, DOCTOR_RECOMMENDATION } from '../../../services/api';
import { useNavigate } from 'react-router-dom';



// Data for hospitals based on city
const hospitalsByCity = {
  Cairo: [
    'Cleopatra Hospital',
    'Al Salam Hospital',
    'Dar Al Fouad Hospital',
    'As-Salam International Hospital'
  ],
  Alexandria: [
    'Alexandria University Hospital',
    'Pharos Hospital',
    'Andalusia Smouha Hospital'
  ],
  Giza: [
    'Agouza Hospital',
    'Giza International Hospital',
    'Al Mokattam Hospital'
  ],
  Luxor: [
    'Luxor International Hospital',
    'Luxor General Hospital'
  ],
  // Add more cities and their hospitals as needed
};

const DoctorRecommendation = () => {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState(''); // Default to empty string for "All"
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorType, setSelectedDoctorType] = useState('All Doctors');
  const [selectedCity, setSelectedCity] = useState('Cairo');
  const [selectedHospital, setSelectedHospital] = useState('Cleopatra Hospital');
  const [availableHospitals, setAvailableHospitals] = useState(hospitalsByCity['Cairo']);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state variables for additional filters
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedFees, setSelectedFees] = useState('');

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Mapping for selectedDoctorType to actual specialty strings for API
  const doctorTypeToSpecialtyMap = {
    'All Doctors': '', // Empty string for no specialty filter
    'Cardiologists': 'Cardiology',
    'Dermatologists': 'Dermatology',
    'Neurologists': 'Neurology',
    'Orthopedic Surgery': 'Orthopedic Surgery',
    'Dentistry': 'Dentistry',
    'Pediatrics': 'Pediatrics',
    'Nephrology': 'Nephrology',
    'Oncology': 'Oncology',
    'Neurosurgery': 'Neurosurgery',

    'Internist': 'Internist',
    'Ophthalmology': 'Ophthalmology',
  };

  // Effect to update available hospitals when selectedCity changes
  useEffect(() => {
    setAvailableHospitals(hospitalsByCity[selectedCity] || []);
    if (selectedHospital && !hospitalsByCity[selectedCity]?.includes(selectedHospital)) {
      setSelectedHospital(hospitalsByCity[selectedCity]?.[0] || '');
    } else if (!selectedHospital && hospitalsByCity[selectedCity]?.length > 0) {
      setSelectedHospital(hospitalsByCity[selectedCity][0]);
    } else if (hospitalsByCity[selectedCity]?.length === 0) {
      setSelectedHospital('');
    }
  }, [selectedCity, selectedHospital]);

  // Effect to fetch doctors from API based on filters
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        const limit = 10; // You might want to make this dynamic later
        const page = 1;   // You might want to make this dynamic later

        const currentSpecialty = selectedSpecialty;
        const currentCity = selectedCity;

        const options = {
          limit,
          page,
          ...(searchQuery && { search: searchQuery }), // Add search query if present
          ...(selectedTitle && { title: selectedTitle }),
          ...(selectedGender && { gender: selectedGender }),
          ...(selectedRating && { rating: selectedRating }), // Assuming API uses 'rating'
          ...(selectedAvailability && { availability: selectedAvailability }), // Assuming API uses 'availability'
          ...(selectedFees && { fees: selectedFees }), // Assuming API uses 'fees'
        };

        if (currentSpecialty && currentCity !== 'Cairo') {
          response = await privateInstance.get(
            DOCTOR_RECOMMENDATION.Get_Doctors_By_City_And_Specialty(
              currentCity,
              currentSpecialty,
              options
            )
          );
        } else if (currentSpecialty) {
          response = await privateInstance.get(
            DOCTOR_RECOMMENDATION.Get_All_Doctors_By_Specialty(
              currentSpecialty,
              options
            )
          );
        } else if (currentCity !== 'Cairo') {
          response = await privateInstance.get(
            DOCTOR_RECOMMENDATION.Get_Doctors_By_City(
              currentCity,
              options
            )
          );
        } else {
          response = await privateInstance.get(DOCTOR_RECOMMENDATION.Get_All_Doctors(options));
        }

        if (response.data.status === "success" && response.data.data && Array.isArray(response.data.data)) {
          const mappedDoctors = response.data.data.map(doc => ({
            id: doc._id || doc.id,
            name: doc.name || 'N/A',
            title: doc.description || 'Doctor',
            specialty: doc.specialization || 'N/A',
            overallRating: doc.rating || 0,
            visitors: doc.num_visitors || 0,
            hygieneRating: doc.hygiene_rating || 0,
            goodListenerRating: doc.listener_rating || 0,
            subSpecialties: Array.isArray(doc.sub_specializations) ? doc.sub_specializations : [],
            location: doc.clinic_location || 'N/A',
            fees: doc.fees || 0,
            waitingTime: doc.waiting_time || 'N/A',
            callCost: doc.call_cost || 'N/A',
            availability: doc.availability || 'N/A',
            imageUrl: doc.profile_image || "https://via.placeholder.com/150",
          }));
          setDoctors(mappedDoctors);

          if (mappedDoctors.length === 0) {
            setError("No doctors found matching your criteria.");
          }
        } else if (response.data.status === "fail" && response.data.errors && response.data.errors.length > 0) {
          setError(response.data.errors[0].msg);
        } else {
          setError("Unexpected response format or no doctors found.");
          console.warn("API response unexpected:", response.data);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please check your network or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty, selectedCity, searchQuery, selectedTitle, selectedGender, selectedRating, selectedAvailability, selectedFees]);

  const handleDoctorTypeChange = (e) => {
    const value = e.target.value;
    setSelectedDoctorType(value);
    setSelectedSpecialty(doctorTypeToSpecialtyMap[value] || '');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Trigger useEffect by updating searchQuery
    // Assuming you have an input for searchQuery that updates the state
  };

  const specialtyIcons = {
    'Orthopedic Surgery': <FaUserInjured size={24} />,
    'Dermatology': <FaUserMd size={24} />,
    'Dentistry': <FaTooth size={24} />,
    'Pediatrics': <FaBaby size={24} />,
    'Nephrology': <FaFlask size={24} />,
    'Oncology': <FaDisease size={24} />,
    'Neurosurgery': <FaBrain size={24} />,
    'Cardiology': <FaHeartbeat size={24} />,

    'Internist': <FaStethoscope size={24} />,
    'Ophthalmology': <FaEye size={24} />,
    'Neurology': <FaBrain size={24} />,
  };

  // No client-side filtering by searchQuery here as it's passed to the API
  const filteredDoctors = doctors;

  const handleDoctorClick = async (doctor) => {
    setSelectedDoctor(doctor);
    setLoadingDetails(true);
    try {
      const response = await privateInstance.get(
        DOCTOR_RECOMMENDATION.Get_Specific_Doctor_By_Id(doctor.id)
      );
      if (response.data.status === "success") {
        setDoctorDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null);
    setDoctorDetails(null);
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderSpinner}></div>
      </div>
    );
  }

  if (error) {
    // Check if the error message indicates no doctors are available
    if (error.includes("no doctors available") || error.includes("No doctors found matching your criteria.") || error.includes("Unexpected response format or no doctors found.")) {
      return (
        <div className={styles.noDoctorModal}>
          <div className={styles.noDoctorContent}>
            <button className={styles.modalCloseButton} onClick={() => {
              setError(null);
              setSelectedSpecialty('');
              setSelectedCity('Cairo');
              setSelectedHospital('Cleopatra Hospital');
              setSelectedTitle('');
              setSelectedGender('');
              setSelectedRating('');
              setSelectedAvailability('');
              setSelectedFees('');
            }}>
              <FaTimes />
            </button>
            <div className={styles.modalIcon}>
              <FaUserMd />
            </div>
            <h2 className={styles.noDoctorTitle}>No Doctors Available</h2>
            <p className={styles.noDoctorMessage}>
              We couldn't find any doctors matching your criteria at this time.
              Please try adjusting your filters or check back later.
            </p>
            <button
              className={styles.noDoctorButton}
              onClick={() => {
                setError(null);
                setSelectedSpecialty('');
                setSelectedCity('Cairo');
                setSelectedHospital('Cleopatra Hospital');
                setSelectedTitle('');
                setSelectedGender('');
                setSelectedRating('');
                setSelectedAvailability('');
                setSelectedFees('');
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      );
    } else {
      // For any other type of error (network, unexpected API format, etc.)
      return (
        <div className={styles.noDoctorModal}>
          <div className={styles.noDoctorContent}>
            <button className={styles.modalCloseButton} onClick={() => {
              setError(null);
              setSelectedSpecialty('');
              setSelectedCity('Cairo');
              setSelectedHospital('Cleopatra Hospital');
              setSelectedTitle('');
              setSelectedGender('');
              setSelectedRating('');
              setSelectedAvailability('');
              setSelectedFees('');
            }}>
              <FaTimes />
            </button>
            <div className={styles.modalIcon}>
              <FaExclamationCircle />
            </div>
            <h2 className={styles.noDoctorTitle}>Error</h2>
            <p className={styles.noDoctorMessage}>
              {error}
            </p>
            <button
              className={styles.noDoctorButton}
              onClick={() => {
                setError(null);
                setSelectedSpecialty('');
                setSelectedCity('Cairo');
                setSelectedHospital('Cleopatra Hospital');
                setSelectedTitle('');
                setSelectedGender('');
                setSelectedRating('');
                setSelectedAvailability('');
                setSelectedFees('');
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContent}>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchFieldsGroup}>
              <div className={styles.inputGroupCompact}>
                <label htmlFor="selectDoctorType" className={styles.labelCompact}>Select Doctor</label>
                <select
                  id="selectDoctorType"
                  className={styles.selectInputCompact}
                  value={selectedDoctorType}
                  onChange={handleDoctorTypeChange}
                >
                  <option value="All Doctors">All Doctors</option>
                  <option value="Cardiologists">Cardiologists</option>
                  <option value="Dermatologists">Dermatologists</option>
                  <option value="Neurologists">Neurologists</option>
                </select>
              </div>

              <div className={styles.separator}></div>

              <div className={styles.inputGroupCompact}>
                <label htmlFor="selectCity" className={styles.labelCompact}>Select City</label>
                <select
                  id="selectCity"
                  className={styles.selectInputCompact}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {Object.keys(hospitalsByCity).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className={styles.separator}></div>

              <div className={styles.inputGroupCompact}>
                <label htmlFor="selectHospital" className={styles.labelCompact}>Search Doctor, clinics, hospital, etc.</label>
                <select
                  id="selectHospital"
                  className={styles.selectInputCompact}
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                >
                  {availableHospitals.length > 0 ? (
                    availableHospitals.map(hospital => (
                      <option key={hospital} value={hospital}>{hospital}</option>
                    ))
                  ) : (
                    <option value="">No hospitals for this city</option>
                  )}
                </select>
              </div>

              <button type="submit" className={styles.searchButtonCompact}>
                Search
              </button>
            </div>
          </form>
        </div>

        <div className={styles.doctorRecommendation}>
          <div className={styles.specialtyFilters}>
            {Object.entries(specialtyIcons).map(([name, icon]) => (
              <div
                key={name}
                className={styles.specialtyItem}
                onClick={() => setSelectedSpecialty(name)}
              >
                <div
                  className={
                    name === selectedSpecialty
                      ? `${styles.iconContainer} ${styles.selectedSpecialty}`
                      : styles.iconContainer
                  }
                >
                  {icon}
                </div>
                <span>{name}</span>
              </div>
            ))}
          </div>

          <div className={styles.filterOptions}>
            <select className={styles.filterDropdown} value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
              <option value="">Title</option>
              <option value="Junior resident">Junior resident</option>
              <option value="Senior resident">Senior resident</option>
              <option value="Head of department">Head of department</option>
              <option value="Professor">Professor</option>
              <option value="Consultant">Consultant</option>
              <option value="Specialist">Specialist</option>
              <option value="General Practitioner">General Practitioner</option>
            </select>
            <select className={styles.filterDropdown} value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select className={styles.filterDropdown} value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
              <option value="">Rating</option>
              <option value="1">1 Star ⭐</option>
              <option value="2">2 Stars ⭐⭐</option>
              <option value="3">3 Stars ⭐⭐⭐</option>
              <option value="4">4 Stars ⭐⭐⭐⭐</option>
              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
            </select>
            <select className={styles.filterDropdown} value={selectedAvailability} onChange={(e) => setSelectedAvailability(e.target.value)}>
              <option value="">Availability</option>
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="Next Week">Next Week</option>
              <option value="Next Month">Next Month</option>
            </select>
            <select className={styles.filterDropdown} value={selectedFees} onChange={(e) => setSelectedFees(e.target.value)}>
              <option value="">Fees</option>
              <option value="0-100">Less than 100 EGP</option>
              <option value="100-300">100 - 300 EGP</option>
              <option value="300-500">300 - 500 EGP</option>
              <option value="500-1000">500 - 1000 EGP</option>
            </select>
          </div>

          <div className={styles.doctorList}>
            {filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                className={styles.doctorCard}
                onClick={() => handleDoctorClick(doctor)}
              >
                <div className={styles.doctorInfo}>
                  <div className={styles.doctorImageContainer}>
                    <img
                      src={"https://via.placeholder.com/150?text=Dr"}
                     
                      className={styles.doctorImage}
                      
                    />
                    <div className={styles.doctorImageOverlay}>
                      <FaUserMd size={30} color="#ffffff" />
                    </div>
                  </div>
                  <div className={styles.details}>
                    <h3 className={styles.doctorName}>
                      <FaUserMd /> Dr. {doctor.name}
                    </h3>
                    <p className={styles.doctorTitle}>{doctor.title}</p>
                    <div className={styles.rating}>
                      <span className={styles.ratingStars}>
                        {'⭐'.repeat(Math.floor(doctor.overallRating))}
                      </span>
                      <span className={styles.ratingText}>
                        {doctor.overallRating} Overall Rating from {doctor.visitors} Visitors
                      </span>
                    </div>
                    <div className={styles.reviewRatings}>
                      {doctor.hygieneRating && (
                        <div className={styles.reviewRating}>
                          <FaStar /> Hygiene: {doctor.hygieneRating}
                        </div>
                      )}
                      {doctor.goodListenerRating && (
                        <div className={styles.reviewRating}>
                          <FaStar /> Good Listener: {doctor.goodListenerRating}
                        </div>
                      )}
                    </div>
                    <p className={styles.specialization}>
                      <span className={styles.boldText}>{doctor.specialty}</span> Specialization in{' '}
                      {Array.isArray(doctor.subSpecialties) && doctor.subSpecialties.map((sub, index) => (
                        <span key={index}>{sub}{index < doctor.subSpecialties.length - 1 ? ', ' : ''}</span>
                      ))}
                    </p>
                    <div className={styles.location}>
                      <FaMapMarkerAlt /> {doctor.location}
                    </div>
                    <div className={styles.fees}>
                      <FaMoneyBillWave /> Fees: {doctor.fees} EGP
                    </div>
                    <div className={styles.waitingTime}>
                      <FaClock /> Waiting Time: {doctor.waitingTime} Minutes
                    </div>
                    <div className={styles.callCost}>
                      <FaPhone /> {doctor.callCost} - Cost of regular call
                    </div>
                  </div>
                </div>
                <div className={styles.availability}>
                  <div className={styles.availabilityDate}>
                    <FaCalendarAlt /> Next Availability: {doctor.availability}
                  </div>
                  <button className={styles.bookNowButton}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDoctor && (
        <div className={styles.doctorDetailsModal}>
          <div className={styles.doctorDetailsContent}>
            <button className={styles.modalCloseButton} onClick={handleCloseDetails}>
              <FaTimes />
            </button>

            {loadingDetails ? (
              <div className={styles.loader}>
                <div className={styles.loaderSpinner}></div>
              </div>
            ) : doctorDetails ? (
              <>
                <div className={styles.doctorDetailsHeader}>
                  <img
                    src={doctorDetails.profile_image || "https://via.placeholder.com/150"}
                    alt={doctorDetails.name}
                    className={styles.doctorDetailsImage}
                  />
                  <div className={styles.doctorDetailsInfo}>
                    <h2 className={styles.doctorDetailsName}>Dr. {doctorDetails.name}</h2>
                    <p className={styles.doctorDetailsTitle}>{doctorDetails.description}</p>
                    <div className={styles.doctorDetailsRating}>
                      <span>{'⭐'.repeat(Math.floor(doctorDetails.rating || 0))}</span>
                      <span>{doctorDetails.rating || 0} Overall Rating from {doctorDetails.num_visitors || 0} Visitors</span>
                    </div>
                  </div>
                </div>

                <div className={styles.doctorDetailsSection}>
                  <h3 className={styles.doctorDetailsSectionTitle}>
                    <FaUserMd /> Professional Information
                  </h3>
                  <div className={styles.doctorDetailsSectionContent}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Specialization</div>
                      <div className={styles.detailValue}>{doctorDetails.specialization}</div>
                    </div>
                    {doctorDetails.sub_specializations && (
                      <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Sub-specializations</div>
                        <div className={styles.detailValue}>
                          {doctorDetails.sub_specializations.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.doctorDetailsSection}>
                  <h3 className={styles.doctorDetailsSectionTitle}>
                    <FaMapMarkerAlt /> Location & Contact
                  </h3>
                  <div className={styles.doctorDetailsSectionContent}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Clinic Location</div>
                      <div className={styles.detailValue}>{doctorDetails.clinic_location}</div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Waiting Time</div>
                      <div className={styles.detailValue}>{doctorDetails.waiting_time} minutes</div>
                    </div>
                  </div>
                </div>

                <div className={styles.doctorDetailsSection}>
                  <h3 className={styles.doctorDetailsSectionTitle}>
                    <FaMoneyBillWave /> Fees & Availability
                  </h3>
                  <div className={styles.doctorDetailsSectionContent}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Consultation Fee</div>
                      <div className={styles.detailValue}>{doctorDetails.fees} EGP</div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Call Cost</div>
                      <div className={styles.detailValue}>{doctorDetails.call_cost} EGP</div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Next Availability</div>
                      <div className={styles.detailValue}>{doctorDetails.availability}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.doctorDetailsActions}>
                  <button className={`${styles.actionButton} ${styles.secondaryAction}`} onClick={handleCloseDetails}>
                    Close
                  </button>
                  <button className={`${styles.actionButton} ${styles.primaryAction}`}>
                    Book Appointment
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.error}>Failed to load doctor details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRecommendation;