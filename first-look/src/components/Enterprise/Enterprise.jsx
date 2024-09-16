import React from 'react';
import { useTranslation } from 'react-i18next';
import './Enterprise.css';

const Enterprise = () => {
    const { t } = useTranslation();

    return (
        <div className="enterprise-plan-container">
            <h2 className="enterprise-title">{t('enterprise.title')}</h2>
            <div className="enterprise-content-wrapper">
                <p className="enterprise-intro-text">
                    {t('enterprise.introText1')}
                </p>
            </div>
            <div className="enterprise-content-wrapper reverse">
                <p className="enterprise-intro-text">
                    {t('enterprise.introText2')}
                </p>
            </div>
            <div className="enterprise-features">
                <h3 className="features-title">{t('enterprise.featuresTitle')}</h3>
                <ul className="features-list">
                    <li><strong>{t('enterprise.feature1')}</strong></li>
                    <li><strong>{t('enterprise.feature2')}</strong></li>
                    <li><strong>{t('enterprise.feature3')}</strong></li>
                </ul>
            </div>
            <p className="enterprise-additional-info">
                {t('enterprise.additionalInfo')}
            </p>
        </div>
    );
}

export default Enterprise;