import TitleBar from '../components/TitleBar';

function CreditsPage() {
    return (
        <div>
            <TitleBar titleKey="creditsText" backButtonKey="backButton" backButtonVisible={true} backButtonPath="/" />
            <h1>Static Info Page</h1>
            <p>This is some static information.</p>
        </div>
    );
}

export default CreditsPage;