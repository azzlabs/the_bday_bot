import React, { useEffect } from 'react';
import WhiteBox from './WhiteBox';
import Button from './Button';

const modalWidth = {
  def: 'w-auto',
  xs: 'w-[25em]',
  sm: 'w-[45em]',
  md: 'w-[55em]',
  lg: 'w-[65em]'
}

const Modal = ({
  isVisible,
  className = '',
  bgClassName = 'items-center',
  innerClassName = 'px-4 py-3',
  headerChildren,
  children,
  size = 'def',
  onClose
}) => {
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.keyCode === 27) {
        onClose(e);
      }
    };
    document.addEventListener('keydown', keyHandler);

    return () => document.removeEventListener('keydown', keyHandler);
  });

  return isVisible ? (
    <div className={`fixed animate-fadein inset-0 z-40 flex justify-center overflow-x-hidden overflow-y-auto p-3 bg-slate-900/20 ${bgClassName}`}>
      <WhiteBox className={`${modalWidth[size]} ${className} bg-white animate-slidein`}>
        <div className={`relative border-b font-bold text-lg ${innerClassName}`}>
          {headerChildren}

          <div className={`font-bold absolute top-0 right-0 p-1.5`}>
            <button className="hover:opacity-60" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-slot="icon" className="w-6 h-6">
                <path d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className={innerClassName}>
          {children}
        </div>
      </WhiteBox>
    </div>
  ) : '';
};

export default Modal;
