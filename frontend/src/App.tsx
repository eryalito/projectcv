import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import AboutPage from './views/AboutPage';
import SettingsPage from './views/SettingsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import './i18n'; // Import the i18n configuration
import FoldersPage from './views/FolderPage';
import GlobalContext from './components/GlobalContext';
import { GetConfig } from '../wailsjs/go/main/App';
import { useTranslation } from 'react-i18next';

export const globalData = {
    folderPath: "",
    configKeys: {
        LANGUAGE: "language",
    },
    setFolderPath: (path: string) => {
        globalData.folderPath = path;
    }
};

function App() {

  const { i18n } = useTranslation();
    useState(() => {
        GetConfig(globalData.configKeys.LANGUAGE).then((lng) => { // Get the language from the configuration 
        i18n.changeLanguage(lng);
        }).catch((err) => {
        console.error(err);
        });
    })
    return (
        <GlobalContext.Provider value={globalData}>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/folder" element={<FoldersPage />} />
                </Routes>
            </Router>
        </GlobalContext.Provider>
    );
}

export default App;