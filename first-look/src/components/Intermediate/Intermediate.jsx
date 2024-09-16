import React from 'react';
import { useTranslation } from 'react-i18next';
import './Intermediate.css';
import intermediate from '../../intermediate.png'; 
import intermediate2 from '../../intermediate2.png'; 

const Intermediate = () => {
    const { t } = useTranslation();

    return (
        <div className="intermediate-container">
            <h2>{t('services.intermediate.title')}</h2>
            <div className="content-wrapper">
                <p className="intro-text">
                    {t('services.intermediate.description')}
                    <ul>
                        {t('services.intermediate.features', { returnObjects: true }).map((feature, index) => (
                            <li key={index}><strong>{feature.label}:</strong> {feature.description}</li>
                        ))}
                    </ul>
                </p>
                <img src={intermediate} alt={t('services.intermediate.imageAlt1')} className="basic-image-1" />
            </div>
            <div className="content-wrapper">
                <img src={intermediate2} alt={t('services.intermediate.imageAlt2')} className="basic-image-2" />
                <p className="intro-text">
                    {t('services.intermediate.descriptionMobile')}
                    <ul>
                        {t('services.intermediate.mobileFeatures', { returnObjects: true }).map((feature, index) => (
                            <li key={index}><strong>{feature.label}:</strong> {feature.description}</li>
                        ))}
                    </ul>
                </p>
            </div>
            <div className="features">
                <h3>{t('services.intermediate.featuresTitle')}</h3>
                <ul>
                    {Object.values(t('services.intermediate.keyFeatures', { returnObjects: true })).map((feature, index) => (
                        <li key={index}><strong>{feature.label}:</strong> {feature.description}</li>
                    ))}
                </ul>
            </div>
            <p className="additional-info">
                {t('services.intermediate.additionalInfo')}
            </p>
        </div>
    );
}

export default Intermediate;