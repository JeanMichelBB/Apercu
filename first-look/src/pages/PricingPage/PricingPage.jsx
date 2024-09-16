import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Pricing from '../../components/Pricing/Pricing';
import './PricingPage.css';

function PricingPage() {
    const { t } = useTranslation();

    return (
        <div>
            <Header />
            <h1>{t('pricingPage.plansTitle')}</h1>
            <div className="pricing-intro">
                <p>{t('pricingPage.introText1')}</p>
            </div>
            <Pricing />
            <div className="pricing-intro">
                <h2>{t('pricingPage.customPlansTitle')}</h2>
                <p dangerouslySetInnerHTML={{ __html: t('pricingPage.customPlansText1') }}></p>
                <p>{t('pricingPage.customPlansText2')}</p>
                <p>{t('pricingPage.customPlansText3')}</p>
                <ul>
                    <li>{t('pricingPage.customPlansList1')}</li>
                    <li>{t('pricingPage.customPlansList2')}</li>
                    <li>{t('pricingPage.customPlansList3')}</li>
                    <li>{t('pricingPage.customPlansList4')}</li>
                </ul>
                <p>{t('pricingPage.customPlansText4')}</p>
            </div>
            <Footer />
        </div>
    );
}

export default PricingPage;