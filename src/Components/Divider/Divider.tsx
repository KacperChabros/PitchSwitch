import React from 'react';

type DividerProps = {
  text?: string;
  icon?: JSX.Element;
  color?: string;
  className?: string;
};

const Divider: React.FC<DividerProps> = ({ text, icon, color = 'gray', className }) => {
  return (
    <div className={`flex items-center my-8 ${className}`}>
      <div className={`flex-grow border-t border-${color}-300`}></div>

      {(text || icon) && (
        <span className={`mx-4 flex items-center text-${color}-500 dark:text-${color}-400`}>
          {icon && <span className="mr-2">{icon}</span>}
          {text && <span>{text}</span>}
        </span>
      )}

      <div className={`flex-grow border-t border-${color}-300`}></div>
    </div>
  );
};

export default Divider;
