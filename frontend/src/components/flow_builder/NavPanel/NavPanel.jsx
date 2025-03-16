import React from 'react';
import './NavPanel.scss';

// Import SVG icons
import menuIcon from '../../../assets/icons/menu-icon.svg';
import homeIcon from '../../../assets/icons/home-icon.svg';
import nodeIcon from '../../../assets/icons/node-icon.svg';
import settingsIcon from '../../../assets/icons/settings-icon.svg';
import themeIcon from '../../../assets/icons/theme-icon.svg';

const NavPanel = ({ toggleTheme, toggleSidebar }) => {
  return (
    <nav className="nav-panel">
      <ul className="nav-panel__list">
        <li className="nav-panel__item nav-panel__item--logo">
          <div className="nav-panel__logo">K</div>
        </li>
        <li className="nav-panel__item">
          <button className="nav-panel__button" onClick={toggleSidebar}>
            <img src={menuIcon} alt="Toggle Sidebar" />
            <span className="nav-panel__tooltip">Toggle Sidebar</span>
          </button>
        </li>
        <li className="nav-panel__item">
          <button className="nav-panel__button">
            <img src={homeIcon} alt="Home" />
            <span className="nav-panel__tooltip">Home</span>
          </button>
        </li>
        <li className="nav-panel__item">
          <button className="nav-panel__button">
            <img src={nodeIcon} alt="Nodes" />
            <span className="nav-panel__tooltip">Nodes</span>
          </button>
        </li>
        <li className="nav-panel__item nav-panel__item--bottom">
          <button className="nav-panel__button" onClick={toggleTheme}>
            <img src={themeIcon} alt="Toggle Theme" />
            <span className="nav-panel__tooltip">Toggle Theme</span>
          </button>
        </li>
        <li className="nav-panel__item nav-panel__item--bottom">
          <button className="nav-panel__button">
            <img src={settingsIcon} alt="Settings" />
            <span className="nav-panel__tooltip">Settings</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavPanel;