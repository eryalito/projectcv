import {useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import './LandingPage.scss';
import GlobalContext from '../components/GlobalContext';
import { ChooseFolder } from '../../wailsjs/go/main/App';

function LandingPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleOpenClick = async () => {
      const result = await ChooseFolder();
      if (result !== "") {
        navigate({
            pathname: "/folder",
            search: `?path=${result}`,
        })
      }
    };

    return (
        <>
            <TitleBar
                titleKey="landingPageTitle"
                backButtonKey=""
                backButtonVisible={false} // Set to false to hide the back button
                backButtonPath="/" // Specify the path for the back button
            />
            <div className="container d-flex flex-column align-items-center mt-4">

                <div className="d-flex flex-column align-items-center mt-auto mb-auto">
                    <div className="btn btn-primary mb-2 custom-btn" onClick={handleOpenClick}>
                        {t('openButton')}
                    </div>
                    <Link to="/settings" className="btn btn-secondary mb-2 custom-btn">
                        {t('settingsButton')}
                    </Link>
                    <Link to="/credits" className="mb-2 custom-link">
                        {t('creditsText')}
                    </Link>
                </div>
            </div>

        </>
    );
}

export default LandingPage;