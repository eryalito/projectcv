import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

function AboutPage() {
    const { t } = useTranslation();
    return (
        <div>
            <TitleBar titleKey="appName" backButtonKey="backButton" backButtonVisible={true} backButtonPath="/" />
            <div className="container">
                <h1>{t("about.pageTitle")}</h1>
                <p>{t("about.description")}</p>
                <p>{t("about.checkoutText")}</p>
                <a href='https://github.com/eryalito/projectcv' target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} /> GitHub Project
                </a>
            </div>
        </div>
    );
}

export default AboutPage;