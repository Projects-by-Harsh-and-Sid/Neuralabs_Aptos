// SVG component for icons
import React from 'react';

const SvgIcon = ({ src, alt, className }) => {
  return (
    <div 
      className={`icon ${className}`} 
      dangerouslySetInnerHTML={{ 
        __html: src
          // Replace fill="black" or fill="#000" with currentColor
          .replace(/fill="(black|#000|#000000)"/g, 'fill="currentColor"')
          // Replace stroke="black" or stroke="#000" with currentColor
          .replace(/stroke="(black|#000|#000000)"/g, 'stroke="currentColor"')
      }}
      aria-label={alt}
    />
  );
};

export default SvgIcon;