import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Service from '../../components/Service/Service';
import './ServicePage.css';

function ServicePage() {
    const { t } = useTranslation();

    return (
        <div>
            <Header />
            <h1>{t('servicePage.title')}</h1>
            <p className="service-intro">
                {t('servicePage.intro')}
            </p>
            <Service />
            <div className="service-intro">
                {t('servicePage.customSolutionsIntro')} <a href="/contact">{t('contact')}</a>
                <h2>{t('servicePage.customSolutionsTitle')}</h2>
                <p>{t('servicePage.customSolutionsDescription')}</p>
                <ul>
                    {t('servicePage.customSolutionsList', { returnObjects: true }).map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <p>{t('servicePage.contactCTA')}</p>
            </div>

            <Footer />
        </div>
    );
}

export default ServicePage;