import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleClick = (planName) => {
        navigate(`/contact?plan=${encodeURIComponent(planName)}`);
    };

    return (
        <div className="pricing-container">
            <div className="pricing-wrapper">
                <div className="pricing-grid">
                    {/* Basic Plan */}
                    <div className="pricing-card">
                        <h2>{t('pricing.basic.title')}</h2>
                        <div className="pricing-contract">
                            <p className="price">{t('pricing.basic.priceRange')}</p>
                            <p className="contract-duration">{t('pricing.basic.contractDuration')}</p>
                        </div>
                        <button className="pricing-btn" onClick={() => handleClick('Basic')}>{t('pricing.basic.buttonText')}</button>
                        <ul>
                            {t('pricing.basic.features', { returnObjects: true }).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <div className="support-details">
                            <h4>{t('pricing.basic.support.title')}</h4>
                            <p dangerouslySetInnerHTML={{ __html: t('pricing.basic.support.details') }}></p>
                        </div>
                    </div>

                    {/* Intermediate Plan */}
                    <div className="pricing-card">
                        <h2>{t('pricing.intermediate.title')}</h2>
                        <div className="pricing-contract">
                            <p className="price">{t('pricing.intermediate.priceRange')}</p>
                            <p className="contract-duration">{t('pricing.intermediate.contractDuration')}</p>
                        </div>
                        <button className="pricing-btn" onClick={() => handleClick('Intermediate')}>{t('pricing.intermediate.buttonText')}</button>
                        <ul>
                            {t('pricing.intermediate.features', { returnObjects: true }).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <div className="support-details">
                            <h4>{t('pricing.intermediate.support.title')}</h4>
                            <p dangerouslySetInnerHTML={{ __html: t('pricing.intermediate.support.details') }}></p>
                        </div>
                    </div>

                    {/* Advanced Plan */}
                    <div className="pricing-card">
                        <h2>{t('pricing.advanced.title')}</h2>
                        <div className="pricing-contract">
                            <p className="price">{t('pricing.advanced.priceRange')}</p>
                            <p className="contract-duration">{t('pricing.advanced.contractDuration')}</p>
                        </div>
                        <button className="pricing-btn" onClick={() => handleClick('Advanced')}>{t('pricing.advanced.buttonText')}</button>
                        <ul>
                            {t('pricing.advanced.features', { returnObjects: true }).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <div className="support-details">
                            <h4>{t('pricing.advanced.support.title')}</h4>
                            <p dangerouslySetInnerHTML={{ __html: t('pricing.advanced.support.details') }}></p>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="pricing-card">
                        <h2>{t('pricing.enterprise.title')}</h2>
                        <div className="pricing-contract">
                            <p className="price">{t('pricing.enterprise.priceRange')}</p>
                            <p className="contract-duration">{t('pricing.enterprise.contractDuration')}</p>
                        </div>
                        <button className="pricing-btn" onClick={() => handleClick('Enterprise')}>{t('pricing.enterprise.buttonText')}</button>
                        <ul>
                            {t('pricing.enterprise.features', { returnObjects: true }).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <div className="support-details">
                            <h4>{t('pricing.enterprise.support.title')}</h4>
                            <p dangerouslySetInnerHTML={{ __html: t('pricing.enterprise.support.details') }}></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;