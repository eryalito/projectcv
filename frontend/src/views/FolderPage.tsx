import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import { GetGitStatus } from '../../wailsjs/go/main/App';
import { useEffect, useState } from 'react';
import { getGitStatusCode, StatusCode } from '../components/Git';
import './FolderPage.scss';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

interface FileStatus {
    file: string;
    status: StatusCode;
}

const FolderPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const query = useQuery();
    const path = query.get('path');
    if (path === null) {
        navigate('/');
        return <></>;
    }
    const folderName = path ? path.split(/[/\\]/).filter(Boolean).pop() : '';

    const [status, setStatus] = useState<FileStatus[]>([]);
    useEffect(() => {
        GetGitStatus(path).then((st) => {
            const fileStatusList = new Array<FileStatus>();
            for (const file in st) {
                const fileStatus = getGitStatusCode(st[file].Staging, st[file].Worktree);
                fileStatusList.push({
                    file: file,
                    status: fileStatus
                });
            }
            setStatus(fileStatusList);
        });
    }, []);

    return (
        <div className="h-100">
            <TitleBar titleKey={path ?? "Unknown"} translateTitle={false} backButtonKey="backButton" backButtonVisible={true} backButtonPath="/" />
            <div className="container d-flex flex-column align-items-center mt-4">
                <p>Path: {path}</p>
                <div className="table-responsive w-100">
                    <table className="table table-hover custom-table-width">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">File</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status.map((fileStatus, index) => {
                                let rowClass = '';
                                switch (fileStatus.status) {
                                    case StatusCode.Modified:
                                        rowClass = 'bg-modified'; // light yellow
                                        break;
                                    case StatusCode.Added:
                                    case StatusCode.Untracked:
                                        rowClass = 'bg-added'; // light green
                                        break;
                                    case StatusCode.Deleted:
                                        rowClass = 'bg-deleted'; // light red
                                        break;
                                    default:
                                        rowClass = '';
                                }
                                return (
                                    <tr key={index} className={rowClass}>
                                        <td className='bg-inherited'>{fileStatus.file}</td>
                                        <td className='bg-inherited'>{fileStatus.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default FolderPage;