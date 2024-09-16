import React, { useState, useRef, useEffect } from 'react';
import './Service.css';
import Basic from '../../components/Basic/Basic';
import Intermediate from '../../components/Intermediate/Intermediate';
import Advanced from '../../components/Advanced/Advanced';
import Enterprise from '../../components/Enterprise/Enterprise';

const Service = () => {
    const [activeService, setActiveService] = useState(null);
    const detailsContainerRef = useRef(null);

    const handleCardClick = (service) => {
        setActiveService(service === activeService ? null : service);
    };

    useEffect(() => {
        if (detailsContainerRef.current) {
            // Add/remove 'expanded' class based on activeService
            if (activeService) {
                detailsContainerRef.current.classList.add('expanded');
                detailsContainerRef.current.classList.remove('collapsed');
            } else {
                detailsContainerRef.current.classList.add('collapsed');
                detailsContainerRef.current.classList.remove('expanded');
            }
        }
    }, [activeService]);

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
            <div 
                className="service-details-container" 
                ref={detailsContainerRef}
            >
                <div className={`service-details ${activeService === 'basic' ? 'active' : ''}`}>
                    <Basic />
                </div>
                <div className={`service-details ${activeService === 'intermediate' ? 'active' : ''}`}>
                    <Intermediate />
                </div>
                <div className={`service-details ${activeService === 'advanced' ? 'active' : ''}`}>
                    <Advanced />
                </div>
                <div className={`service-details ${activeService === 'enterprise' ? 'active' : ''}`}>
                    <Enterprise />
                </div>
            </div>
            {/* see pricing */}
            <a href="/pricing" className="pricing-link">See Pricing</a>
        </div>
    );
}

export default Service;