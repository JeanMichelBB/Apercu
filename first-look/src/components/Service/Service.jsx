import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import './Service.css';
import Basic from '../../components/Basic/Basic';
import Intermediate from '../../components/Intermediate/Intermediate';
import Advanced from '../../components/Advanced/Advanced';
import Enterprise from '../../components/Enterprise/Enterprise';

const Service = () => {
    const { t } = useTranslation();
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
                    <h2>{t('service.basicTitle')}</h2>
                    <p>{t('service.basicDescription')}</p>
                </div>
                <div 
                    className={`service-card ${activeService === 'intermediate' ? 'active' : ''}`} 
                    onClick={() => handleCardClick('intermediate')}
                >
                    <h2>{t('service.intermediateTitle')}</h2>
                    <p>{t('service.intermediateDescription')}</p>
                </div>
                <div 
                    className={`service-card ${activeService === 'advanced' ? 'active' : ''}`} 
                    onClick={() => handleCardClick('advanced')}
                >
                    <h2>{t('service.advancedTitle')}</h2>
                    <p>{t('service.advancedDescription')}</p>
                </div>
                <div 
                    className={`service-card ${activeService === 'enterprise' ? 'active' : ''}`} 
                    onClick={() => handleCardClick('enterprise')}
                >
                    <h2>{t('service.enterpriseTitle')}</h2>
                    <p>{t('service.enterpriseDescription')}</p>
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
            <a href="/pricing" className="pricing-link">{t('service.seePricing')}</a>
        </div>
    );
}

export default Service;