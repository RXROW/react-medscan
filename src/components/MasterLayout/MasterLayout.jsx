import React from 'react';
import { Outlet } from 'react-router-dom';
import './MasterLayout.css'; 
import DrNavbar from '../DrNavbar/DrNavbar';
import PatientSidebar from '../patientsidebar/PatientSB'; 
const MasterLayout = () => {
    

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
          <PatientSidebar /> 

            {/* Main Content */}
            <main className="main-content">
           <DrNavbar /> 
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MasterLayout;
