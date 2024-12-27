import React, { useState, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';

const WhiteBox = ({
  children,
  className = '',
  innerClassName = '',
  collapsibleClassName = '',
  caretClassName = '',
  isCollapsible,
  isExpanded = false,
  hideOverflow = true,
  headerChildren = '',
  customCollapsing = false,
  onButtonClick = () => null,
  ...props
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  return (
    <div
      className={`bg-white rounded-2xl box-shadow-movo m-4 ${
        hideOverflow ? 'overflow-hidden' : ''
      } ${className}`}
      {...props}
    >
      {isCollapsible ? (
        <>
          <div
            className={`relative hover:bg-slate-50 active:bg-slate-100 cursor-pointer ${innerClassName}`}
            onClick={() => {
              setExpanded(!expanded);
              onButtonClick(!expanded);
            }}
          >
            {typeof headerChildren === 'function' ? headerChildren(expanded) : headerChildren}

            <div className={`font-bold absolute top-0 right-0 p-6 ${caretClassName}`}>
              <button>
                <FaAngleDown className={`text-lg ${expanded && 'transform rotate-180'}`} />
              </button>
            </div>
          </div>

          {(expanded || customCollapsing) && (
            <div className={collapsibleClassName || innerClassName}>{children}</div>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
};

export default WhiteBox;
