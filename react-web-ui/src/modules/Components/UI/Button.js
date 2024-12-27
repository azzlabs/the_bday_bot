import React from 'react';
// import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const buttonStyles = {
  default: {
    default: 'text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
    selected: 'bg-orange-800',
  },
  gray: {
    default:
      'text-black bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-50 disabled:hover:bg-slate-200',
    selected: 'bg-slate-400', // Changed from bg-orange-900 to a gray color
  },
  lightGray: {
    default: 'text-slate-900 bg-slate-100 hover:bg-slate-50 active:bg-slate-200',
    selected: 'bg-slate-200',
  },
  darkGray: {
    default: 'text-white bg-gray-500 hover:bg-gray-600',
    selected: 'bg-gray-800',
  },
  black: {
    default: 'text-white bg-gray-700 hover:bg-gray-800',
    selected: 'bg-gray-800',
  },
  white: {
    default: 'text-orange-600 bg-white hover:bg-slate-50 active:bg-slate-100',
    selected: 'bg-slate-100',
  },
  red: {
    default: 'text-red-600 bg-red-200 hover:bg-red-100 active:bg-red-50',
    selected: 'bg-red-200',
  },
  slate: {
    default: 'text-orange-600 bg-slate-200 hover:bg-slate-100 active:bg-slate-50',
    selected: 'bg-slate-200',
  },
  lightSlate: {
    default: 'text-orange-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300',
    selected: 'bg-slate-300',
  },
  lightSlateTransparent: {
    default: 'text-orange-600 hover:bg-slate-200 active:bg-slate-300',
    selected: 'bg-slate-300',
  },
  inFormStyle: {
    default:
      'text-orange-600 bg-white hover:bg-slate-100 active:bg-slate-200 !py-2.5 h-9 disabled:opacity-50',
    selected: 'bg-slate-200',
  },
  inFormStyleBlue: {
    default:
      'text-white bg-sky-600 hover:bg-sky-800 active:bg-sky-900 border border-sky-600 !py-0 h-[2.1rem] disabled:opacity-50',
    selected: 'bg-slate-200',
  },
  whiteLightButton: {
    default:
      'bg-white enabled:hover:bg-slate-200 enabled:active:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-200 !px-3 !py-1 border border-slate-300',
    selected: 'bg-slate-200',
  },
  whiteSkyLightButton: {
    default:
      'bg-white text-sky-600 enabled:hover:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed p-2 border border-slate-300',
    selected: 'bg-slate-200',
  },
  tableItemAction: {
    default: 'text-sky-600 bg-slate-50 hover:bg-slate-100 active:bg-slate-200',
    selected: 'bg-slate-200',
  },
  toggleSwitch: {
    default:
      'bg-gray-100 hover:bg-slate-200 text-xs font-semibold py-[2px] !rounded-2xl border-slate-700 disabled:cursor-not-allowed disabled:text-gray-300 border whitespace-nowrap',
    selected: 'bg-slate-700 text-white hover:bg-slate-700 disabled:text-white',
  },
  stitchedArea: {
    default:
      'flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-500',
    selected: 'bg-sky-400',
  },
  whiteLink: { default: 'text-white hover:opacity-80', selected: '' },
  unstyled: { default: '', selected: '' },

  alertYellow: { default: 'bg-white text-amber-900', selected: '' },
  alertGreen: { default: 'bg-white text-green-900', selected: '' },
  alertRed: { default: 'bg-white text-red-900', selected: '' },
  alertBlue: { default: 'bg-white text-sky-900', selected: '' },
  alertPurple: { default: 'bg-white text-purple-900', selected: '' },
  alertOrange: { default: 'bg-white text-orange-900', selected: '' },

  levelGreen: {
    default: 'text-green-600 enabled:hover:bg-green-100 border border-green-600',
    selected: '!text-white !bg-green-600',
  },
  levelYellow: {
    default: 'text-yellow-500 enabled:hover:bg-yellow-100 border border-yellow-500',
    selected: '!text-white !bg-yellow-500',
  },
  levelRed: {
    default: 'text-red-500 enabled:hover:bg-red-100 border border-red-500',
    selected: '!text-white !bg-red-500',
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
  const classes = `rounded disabled:bg-opacity-80 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-nowrap ${
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
