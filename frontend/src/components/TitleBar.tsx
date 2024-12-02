import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TitleBar.scss';

interface TitleBarProps {
  titleKey: string;
  backButtonKey?: string;
  backButtonVisible?: boolean;
  backButtonPath?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({
  titleKey,
  backButtonKey,
  backButtonVisible = true,
  backButtonPath = "/"
}) => {
  const { t } = useTranslation();

  return (
    <div className="title-bar row w-100 m-0">
      <div className="col-2 d-flex align-items-center">
        {backButtonVisible && (
          <Link to={backButtonPath} className="title-link">
            <i className="bi bi-arrow-left"></i>{t(backButtonKey || '')}
          </Link>
        )}
      </div>
      <div className="col-8 d-flex justify-content-center align-items-center">
        <h1>{t(titleKey)}</h1>
      </div>
      <div className="col-2"></div>
    </div>
  );
};

export default TitleBar;