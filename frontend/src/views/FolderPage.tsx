import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import { GetGitStatus, GitAddAllFiles, GitCheckout, GitCommit, GitGetLastCommit, GitLog, InitGitRepoIfNotExists } from '../../wailsjs/go/main/App';
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

interface Commit {
    hash: string;
    text: string;
    committer: {
        name: string;
        email: string;
        when: string;
    }
}

const FolderPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const query = useQuery();
    const queryPath = query.get('path');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showVersionsModal, setVersionsModal] = useState(false);
    const [commitText, setCommitText] = useState('');
    if (queryPath === null) {
        navigate('/');
        return <></>;
    }
    const folderName = queryPath ? queryPath.split(/[/\\]/).filter(Boolean).pop() : '';

    const [status, setStatus] = useState<FileStatus[]>([]);
    const [log, setLog] = useState<Commit[]>([]);
    const [lastCommitHash, setLastCommitHash] = useState<Commit|null>(null);
    useEffect(() => {
        InitGitRepoIfNotExists(queryPath).then(() => {
            loadFolderInfo();
        }).catch((err) => {
            console.error(err);
            alert('Failed to initialize git repository');
        });
    }, []);

    const handleSaveAllClick = () => {
        setShowSaveModal(true);
    };

    const handleVersionsClick = () => {
        setVersionsModal(true);
    };
    const handleSaveConfirm = () => {
        console.log(commitText);
        GitAddAllFiles(queryPath).then(() => {
            GitCommit(queryPath, commitText).then(() => {
                loadFolderInfo();
                setShowSaveModal(false);
            }).catch((err) => {
                console.error(err);
                alert('Failed to commit changes');
            });
        }).catch((err) => {
            console.error(err);
            alert('Failed to save all files');
        });
    };

    const handleSaveCancel = () => {
        setShowSaveModal(false);
    };

    const loadFolderInfo = () => {
        getFolderStatus();
        getFolderLog();
        getLastCommit();
    }

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

    const getFolderLog = () => {
        GitLog(queryPath).then((log) => {
            console.log(log)
            const list = new Array<Commit>();
            log.forEach((commit) => {
                const hashHex = commit.Hash.map((int: number) => int.toString(16).padStart(2, '0')).join('');
                list.push({
                    hash: hashHex,
                    text: commit.Message,
                    committer: {
                        name: commit.Committer.Name,
                        email: commit.Committer.Email,
                        when: commit.Committer.When
                    }
                });
            });
            setLog(list);
        });
    }

    const getLastCommit = () => {
        GitGetLastCommit(queryPath).then((commit) => {
            console.log(commit);
            const hashHex = commit.Hash.map((int: number) => int.toString(16).padStart(2, '0')).join('');
            setLastCommitHash({
                hash: hashHex,
                text: commit.Message,
                committer: {
                    name: commit.Committer.Name,
                    email: commit.Committer.Email,
                    when: commit.Committer.When
                }
            });
        });
    }


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

    const checkoutCommit = (hash: string) => {
        console.log(hash);
        GitCheckout(queryPath, hash).then(() => {
            loadFolderInfo();
            setVersionsModal(false);
        }).catch((err) => {
            console.error(err);
            alert('Failed to checkout commit');
        });
    }


    const saveModal = (
        <ReactModal
            isOpen={showSaveModal}
            contentLabel="onRequestClose Example"
            onRequestClose={handleSaveCancel}
            className="Modal"
            overlayClassName="Overlay"
        >
            <div className="d-flex flex-column align-items-center">
                <h2>Save All</h2>
                <p>Enter commit message</p>
                <input type="text" value={commitText} onChange={(e) => setCommitText(e.target.value)} />
                <div className="d-flex justify-content-between w-100 mt-3">
                    <button className="btn btn-success" onClick={handleSaveConfirm}>{t('confirm')}</button>
                    <button className="btn btn-danger" onClick={handleSaveCancel}>{t('cancel')}</button>
                </div>
            </div>
        </ReactModal>
    )

    function getDayFromDate(date: string) {
        return date.split('T')[0];
    }

    const versionsModal = (
        <ReactModal
            isOpen={showVersionsModal}
            contentLabel="onRequestClose Example"
            onRequestClose={() => setVersionsModal(false)}
            className="Modal"
            overlayClassName="Overlay"
            appElement={document.getElementById('root')!}
        >
            <div className="d-flex flex-column align-items-center">
                <h2>Versions</h2>
                <div className="table-responsive w-100 mt-4" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
                    <table className="table table-hover custom-table-width">
                        <thead>
                            <tr>
                                <th>Hash</th>
                                <th>Committer</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {log.map((commit) => (
                                <tr key={commit.hash}>
                                    <td title={commit.hash}>{commit.hash.substring(0, 8)}</td>
                                    <td>{commit.committer.name}</td>
                                    <td title={commit.text}>{commit.text.substring(0, 24)}</td>
                                    <td title={commit.committer.when}>{getDayFromDate(commit.committer.when)}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => checkoutCommit(commit.hash)}>Checkout</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between w-100 mt-3">
                    <button className="btn btn-danger" onClick={() => setVersionsModal(false)}>{t('close')}</button>
                </div>
            </div>
        </ReactModal>
    )

    return (
        <div className="vh-100">
            <TitleBar titleKey={folderName ?? "Unknown"} translateTitle={false} backButtonKey="backButton" backButtonVisible={true} backButtonPath="/" />
            <div className="container d-flex flex-column align-items-center mt-4">
                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <p className="font-weight-bold">Path: {queryPath}</p>
                    <p className="font-weight-bold" title={lastCommitHash?.hash}>Last Commit: {lastCommitHash?.text}</p>
                    <button className="btn btn-primary" onClick={loadFolderInfo}>{t("reload")}</button>
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
                    <button className="btn btn-success mr-2" onClick={handleVersionsClick}>{t("versions")}</button>
                    <button className="btn btn-success" onClick={handleSaveAllClick}>{t("save_all")}</button>
                </div>
            </div>
            {saveModal}
            {versionsModal}
        </div>
    );
}



export default FolderPage;