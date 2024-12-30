import React from 'react';
// import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const buttonStyles = {
  default: {
    default: 'text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700',
    selected: 'bg-sky-800',
  },
  secondary: {
    default: 'text-sky-700 bg-sky-100 hover:bg-sky-50 active:text-sky-900',
    selected: 'bg-sky-800',
  },
  danger: {
    default: 'text-red-600 bg-red-50 hover:bg-red-100 active:text-red-900',
    selected: 'bg-red-800',
  },
  link: {
    default: 'text-sky-700 bg-white hover:bg-sky-50 active:!text-sky-900 !text-sky-700',
    selected: 'bg-sky-800',
  },
};

const Button = ({
  children,
  btnStyle,
  className,
  selected,
  to,
  href,
  isLoading = false,
  ...props
}) => {
  const classes = `rounded disabled:bg-opacity-80 disabled:cursor-not-allowed px-4 py-1.5 text-sm font-medium text-nowrap ${
    buttonStyles[btnStyle || 'default']?.default
  } ${className || ''}
    ${selected && buttonStyles[btnStyle || 'default'].selected}`;

  return href ? (
    <a className={classes} href={href} {...props}>
      {children}
    </a>
  ) : (
    <button className={classes} disabled={props.disabled || isLoading} {...props}>
      {isLoading ? (
        <LoadingSpinner className="h-3 inline relative bottom-[2px] right-[2px]" />
      ) : null}{' '}
      {children}
    </button>
  );
};

export default Button;
