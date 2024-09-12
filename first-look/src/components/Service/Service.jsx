import React, { useState } from 'react';
import './Service.css';

const Service = () => {
    const [activeService, setActiveService] = useState(null);

    const handleCardClick = (service) => {
        // Toggle the service details
        setActiveService(service === activeService ? null : service);
    };

    return (
        <div className="service-container">
            <div className="service-grid">
                <div 
                    className={`service-card ${activeService === 'basic' ? 'active' : ''}`} 
                    onClick={() => handleCardClick('basic')}
                >
                    <h2>Basic</h2>
                    <p>For small projects and personal use. Includes essential features.</p>
                </div>
                <div 
                    className={`service-card ${activeService === 'intermediate' ? 'active' : ''}`} 
                    onClick={() => handleCardClick('intermediate')}
                >
                    <h2>Intermediate</h2>
                    <p>Perfect for growing businesses needing more resources and flexibility.</p>
                </div>
                <div 
                    className={`service-card ${activeService === 'advanced' ? 'active' : ''}`} 
                    onClick={() => handleCardClick('advanced')}
                >
                    <h2>Advanced</h2>
                    <p>Advanced tools and customization for larger applications.</p>
                </div>
                <div 
                    className={`service-card ${activeService === 'enterprise' ? 'active' : ''}`} 
                    onClick={() => handleCardClick('enterprise')}
                >
                    <h2>Enterprise</h2>
                    <p>Full-scale solutions for businesses requiring a dedicated team.</p>
                </div>
            </div>
            <div className="service-details-container">
                <div className={`service-details ${activeService === 'basic' ? 'active' : ''}`}>
                    <h2>Basic</h2>
                    <p>Detailed information about the Basic service.</p>
                </div>
                <div className={`service-details ${activeService === 'intermediate' ? 'active' : ''}`}>
                    <h2>Intermediate</h2>
                    <p>Detailed information about the Intermediate service.</p>
                </div>
                <div className={`service-details ${activeService === 'advanced' ? 'active' : ''}`}>
                    <h2>Advanced</h2>
                    <p>Detailed information about the Advanced service.</p>
                </div>
                <div className={`service-details ${activeService === 'enterprise' ? 'active' : ''}`}>
                    <h2>Enterprise</h2>
                    <p>Detailed information about the Enterprise service.</p>
                </div>
            </div>
        </div>
    );
}

export default Service;