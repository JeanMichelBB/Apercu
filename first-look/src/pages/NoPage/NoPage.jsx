import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './NoPage.css';

function NoPage() {
    const { t } = useTranslation();

    return (
        <div className="no-page-container">
            <Header />
            <main className="no-page-content">
                <h2>{t('error404')}</h2>
                <p>{t('sorryPageNotFound')}</p>
                <p>
                    {t('returnHomeOrContact')}
                    {t('returnHomeOrContact').includes('contact page') && (
                        <>
                            {t('returnHomeOrContact').includes('or') && ' '}
                        </>
                    )}
                </p>
            </main>
            <Footer />
        </div>
    );
}

export default NoPage;