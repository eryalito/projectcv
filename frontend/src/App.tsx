import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import CreditsPage from './views/CreditsPage';
import SettingsPage from './views/SettingsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import './i18n'; // Import the i18n configuration
import FoldersPage from './views/FolderPage';
import GlobalContext from './components/GlobalContext';

const globalData = {
    folderPath: "",
    setFolderPath: (path: string) => {
        globalData.folderPath = path;
    }
};

function App() {

    return (
        <GlobalContext.Provider value={globalData}>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/credits" element={<CreditsPage />} />
                    <Route path="/folder" element={<FoldersPage />} />
                </Routes>
            </Router>
        </GlobalContext.Provider>
    );
}

export default App;