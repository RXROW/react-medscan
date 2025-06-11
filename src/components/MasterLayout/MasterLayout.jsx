import React from 'react';
import { Outlet } from 'react-router-dom';
import './MasterLayout.css';
import DrSidebar from '../drsidebar/DoctorSB';
import DrNavbar from '../DrNavbar/DrNavbar';
import PatientSidebar from '../patientsidebar/PatientSB';
import { useAuthContext } from '../../Context/AuthContext';

const MasterLayout = () => {
    const { userRole } = useAuthContext();

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
          <PatientSidebar /> 

            {/* Main Content */}
            <main className="main-content">
                {userRole === 'doctor' && <DrNavbar />}
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MasterLayout;
