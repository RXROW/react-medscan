import React from 'react';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2>MedScan</h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <a href="/dashboard">
                                <i className="fas fa-home"></i>
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/patients">
                                <i className="fas fa-users"></i>
                                Patients
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/appointments">
                                <i className="fas fa-calendar"></i>
                                Appointments
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/settings">
                                <i className="fas fa-cog"></i>
                                Settings
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-search">
                        <input type="search" placeholder="Search..." />
                    </div>
                    <div className="header-profile">
                        <span className="notifications">
                            <i className="fas fa-bell"></i>
                        </span>
                        <div className="profile-info">
                            <img src="/default-avatar.png" alt="Profile" />
                            <span>Dr. John Doe</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 