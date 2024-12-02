import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';

function SettingsPage() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };


  return (
    <div className="vh-100">
      <TitleBar
        titleKey="settingsTitle"
        backButtonKey="backButton"
        backButtonVisible={true}
        backButtonPath="/" // Specify the path for the back button
      />
      <div className="container d-flex flex-column align-items-center mt-4">
        <div className="d-flex flex-column align-items-center mt-auto mb-auto">
          <div className="form-group">
            <h2><label htmlFor="languageSelect">{t('settingsKey.language')}</label></h2>
            <select
              id="languageSelect"
              className="form-select"
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              {/* Add more languages here */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;