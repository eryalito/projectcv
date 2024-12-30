import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import { GetGitStatus, GitAddAllFiles, GitCommit } from '../../wailsjs/go/main/App';
import { useEffect, useState } from 'react';
import { getGitStatusCode, StatusCode, getGitStatusText } from '../components/Git';
import './FolderPage.scss';
import ReactModal from 'react-modal';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

interface FileStatus {
    file: string;
    status: StatusCode;
    statusText: string;
}

const FolderPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const query = useQuery();
    const queryPath = query.get('path');
    const [showModal, setShowModal] = useState(false);
    const [inputText, setInputText] = useState('');
    if (queryPath === null) {
        navigate('/');
        return <></>;
    }
    const folderName = queryPath ? queryPath.split(/[/\\]/).filter(Boolean).pop() : '';

    const [status, setStatus] = useState<FileStatus[]>([]);
    useEffect(() => {
        getFolderStatus();
    }, []);

    const handleSaveAllClick = () => {
        setShowModal(true);
    };

    const handleConfirm = () => {
        console.log(inputText);
        GitAddAllFiles(queryPath).then(() => {
            GitCommit(queryPath, inputText).then(() => {
                getFolderStatus();
                setShowModal(false);
            }).catch((err) => {
                console.error(err);
                alert('Failed to commit changes');
            });
        }).catch((err) => {
            console.error(err);
            alert('Failed to save all files');
        });
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const getFolderStatus = () => {
        GetGitStatus(queryPath).then((st) => {
            
            const fileStatusList = new Array<FileStatus>();
            for (const file in st) {
                const fileStatus = getGitStatusCode(st[file].Staging, st[file].Worktree);
                fileStatusList.push({
                    file: file,
                    status: fileStatus,
                    statusText: t(getGitStatusText(fileStatus))
                });
            }
            setStatus(fileStatusList);
        });
    };


    const getRowClass = (status: StatusCode) => {
        switch (status) {
            case StatusCode.Modified:
                return 'bg-modified';
            case StatusCode.Added:
            case StatusCode.Untracked:
                return 'bg-added';
            case StatusCode.Deleted:
                return 'bg-deleted';
            default:
                return '';
        }
    };

    return (
        <div className="vh-100">
            <TitleBar titleKey={ folderName ?? "Unknown"} translateTitle={false} backButtonKey="backButton" backButtonVisible={true} backButtonPath="/" />
            <div className="container d-flex flex-column align-items-center mt-4">
                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <p className="font-weight-bold">Path: {queryPath}</p>
                    <button className="btn btn-primary" onClick={getFolderStatus}>{t("reload")}</button>
                </div>
                <div className="table-responsive w-100" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-hover custom-table-width">
                        <tbody>
                            {status.map((fileStatus, index) => {
                                return (
                                    <tr key={index} className={getRowClass(fileStatus.status)}>
                                        <td className='bg-inherited'>{fileStatus.statusText}</td>
                                        <td className='bg-inherited text-left'>{fileStatus.file}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end w-100 mt-3">
                    <button className="btn btn-success" onClick={handleSaveAllClick}>{t("save_all")}</button>
                </div>
            </div>
           <ReactModal 
                isOpen={showModal}
                contentLabel="onRequestClose Example"
                onRequestClose={handleCancel}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="d-flex flex-column align-items-center">
                    <h2>Save All</h2>
                    <p>Enter commit message</p>
                    <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                    <div className="d-flex justify-content-between w-100 mt-3">
                        <button className="btn btn-success" onClick={handleConfirm}>Confirm</button>
                        <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </ReactModal>
        </div>
    );
}

export default FolderPage;