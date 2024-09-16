import React from 'react';
import { useTranslation } from 'react-i18next';
import './Advanced.css';
import advanced from '../../advanced.png'; 
import advanced2 from '../../advanced2.png'; 

const Advanced = () => {
    const { t } = useTranslation();

    return (
        <div className="advanced-container">
            <h2>{t('services.advanced.title')}</h2>
            <div className="content-wrapper">
                <p className="intro-text">
                    {t('services.advanced.description')}
                    <ul>
                        {t('services.advanced.features', { returnObjects: true }).map((feature, index) => (
                            <li key={index}><strong>{feature.label}:</strong> {feature.description}</li>
                        ))}
                    </ul>
                </p>
                <img src={advanced} alt={t('services.advanced.imageAlt1')} className="basic-image-1" />
            </div>
            <div className="content-wrapper">
                <img src={advanced2} alt={t('services.advanced.imageAlt2')} className="basic-image-2" />
                <p className="intro-text">
                    {t('services.advanced.descriptionMobile')}
                    <br />
                    <br />
                    <ul>
                        {t('services.advanced.mobileFeatures', { returnObjects: true }).map((feature, index) => (
                            <li key={index}><strong>{feature.label}:</strong> {feature.description}</li>
                        ))}
                    </ul>
                </p>
            </div>
            <div className="features">
                <h3>{t('services.advanced.featuresTitle')}</h3>
                <ul>
                    {Object.values(t('services.advanced.keyFeatures', { returnObjects: true })).map((feature, index) => (
                        <li key={index}><strong>{feature.label}:</strong> {feature.description}</li>
                    ))}
                </ul>
            </div>
            <p className="additional-info">
                {t('services.advanced.additionalInfo')}
            </p>
        </div>
    );
}

export default Advanced;