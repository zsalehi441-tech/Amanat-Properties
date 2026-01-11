import React from 'react';

interface Props {
  className?: string;
  size?: number | string;
  hideText?: boolean;
  isDarkMode?: boolean;
}

const AmanatLogo: React.FC<Props> = ({ className, size = "100%", isDarkMode = true }) => {
  return (
    <div className={className} style={{ width: size, display: 'inline-block' }}>
      <img
        src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"}
        alt="Amanat Real Estate"
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default AmanatLogo;
