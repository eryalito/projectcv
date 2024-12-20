import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import './LandingPage.scss';
import { handleOpenFolder, registerEvents } from '../operations/events';
import { EventsOnce, EventsOff } from '../../wailsjs/runtime/runtime';

function LandingPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handler = async () => {
        await handleOpenFolder(navigate);
    }
    registerEvents(navigate);
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
                    <div className="btn btn-primary mb-2 custom-btn" onClick={handler}>
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