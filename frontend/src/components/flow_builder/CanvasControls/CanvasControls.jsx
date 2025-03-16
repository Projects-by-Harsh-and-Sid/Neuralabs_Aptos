import React from 'react';
import './CanvasControls.scss';

// Import SVG icons
import zoomInIcon from '../../../assets/icons/zoom-in-icon.svg';
import zoomOutIcon from '../../../assets/icons/zoom-out-icon.svg';
import fitViewIcon from '../../../assets/icons/fit-view-icon.svg';
import orientationIcon from '../../../assets/icons/orientation-icon.svg';
import screenshotIcon from '../../../assets/icons/screenshot-icon.svg';

const CanvasControls = ({ onZoomIn, onZoomOut, onFitView, onToggleOrientation, onScreenshot }) => {
  return (
    <div className="canvas-controls">
      <div className="canvas-controls__group">
        <button className="canvas-controls__button" onClick={onZoomIn} title="Zoom In">
          <img src={zoomInIcon} alt="Zoom In" />
        </button>
        <button className="canvas-controls__button" onClick={onZoomOut} title="Zoom Out">
          <img src={zoomOutIcon} alt="Zoom Out" />
        </button>
        <button className="canvas-controls__button" onClick={onFitView} title="Fit View">
          <img src={fitViewIcon} alt="Fit View" />
        </button>
      </div>
      <div className="canvas-controls__group">
        <button className="canvas-controls__button" onClick={onToggleOrientation} title="Toggle Orientation">
          <img src={orientationIcon} alt="Toggle Orientation" />
        </button>
        <button className="canvas-controls__button" onClick={onScreenshot} title="Screenshot">
          <img src={screenshotIcon} alt="Screenshot" />
        </button>
      </div>
    </div>
  );
};

export default CanvasControls;