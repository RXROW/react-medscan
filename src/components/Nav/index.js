import React from 'react'; 
import GuestNavbar from './GuestNavbar';
import DoctorNavbar from './DoctorNavbar';
import PatientNavbar from './PatientNavbar';

const Navbar = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <GuestNavbar />;
  if (currentUser.role === 'doctor') return <DoctorNavbar />;
  if (currentUser.role === 'patient') return <PatientNavbar />;
};

export default Navbar;