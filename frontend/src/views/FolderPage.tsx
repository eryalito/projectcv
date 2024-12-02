import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import { ChooseFolder, GetGitStatus, InitGitRepoIfNotExists } from '../../wailsjs/go/main/App';
import GlobalContext from '../components/GlobalContext';
import { useNavigate } from "react-router";

interface BodyProps {
    path : string | undefined;
    onClick : () => void;
}

function Body(props: BodyProps) {
    const { t } = useTranslation();
    const path = props.path;
    if (path == "" || path == null) {
        return <div className="d-flex flex-column align-items-center mt-4 mb-auto">
            <button className="btn btn-primary mb-2 custom-btn" onClick={props.onClick}>
            {t('openButton')}
            </button>
        </div>
    }

    return <div className="d-flex flex-column align-items-center mt-4 mb-auto">

    </div>
    
}

function FoldersPage() {
    let navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const globalData = useContext(GlobalContext);

    const handleOpenClick = async () => {
        ChooseFolder().then((result) => {
            if (result == "") {	// If no folder is selected
                navigate("/");
            } else {
                globalData?.setFolderPath(result);
                InitGitRepoIfNotExists(result);
                navigate("/folder");
            }

        });
    };

    return (
        <div className="vh-100">
            <TitleBar
                titleKey="foldersTitle"
                backButtonKey="backButton"
                backButtonVisible={true}
                backButtonPath="/" // Specify the path for the back button
            />
            <Body path={globalData?.folderPath} onClick={handleOpenClick}/>
        </div>
    );
}

export default FoldersPage;