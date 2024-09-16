import React from 'react';
import { useTranslation } from 'react-i18next';
import './Basic.css';
import basic from '../../basic.png';
import basic2 from '../../basic2.png';

const Basic = () => {
    const { t } = useTranslation();

    return (
        <div className="basic-container">
            <h2>{t('services.basic.title')}</h2>
            <div className="content-wrapper">
                <p className="intro-text">
                    {t('services.basic.description')}
                    <br />
                    <br />
                    <ul>
                        <li>{t('services.basic.features.0')}</li>
                        <li>{t('services.basic.features.1')}</li>
                        <li>{t('services.basic.features.2')}</li>
                    </ul>
                </p>
                <img src={basic} alt={t('services.basic.imageAlt1')} className="basic-image-1" />
            </div>
            <div className="content-wrapper">
                <img src={basic2} alt={t('services.basic.imageAlt2')} className="basic-image-2" />
                <p className="intro-text">
                    {t('services.basic.descriptionMobile')}
                    <br />
                    <br />
                    <ul>
                        <li>{t('services.basic.mobileFeatures.0')}</li>
                        <li>{t('services.basic.mobileFeatures.1')}</li>
                        <li>{t('services.basic.mobileFeatures.2')}</li>
                    </ul>
                </p>
            </div>
            <div className="features">
                <h3>{t('services.basic.featuresTitle')}</h3>
                <ul>
                    <li><strong>{t('services.basic.keyFeatures.simpleDesign.label')}:</strong> {t('services.basic.keyFeatures.simpleDesign.description')}</li>
                    <li><strong>{t('services.basic.keyFeatures.coreFunctionality.label')}:</strong> {t('services.basic.keyFeatures.coreFunctionality.description')}</li>
                    <li><strong>{t('services.basic.keyFeatures.responsiveLayout.label')}:</strong> {t('services.basic.keyFeatures.responsiveLayout.description')}</li>
                </ul>
            </div>
            <p className="additional-info">
                {t('services.basic.additionalInfo')}
            </p>
        </div>
    );
}

export default Basic;