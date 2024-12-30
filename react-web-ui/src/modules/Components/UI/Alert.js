import React from "react";
import { FaTimes } from "react-icons/fa";

const wrappers = {
  error: ({className, ...props}) =>
    <div className={`${className || ''} rounded border border-red-600 text-red-700 bg-red-200`} {...props} />,
  info: ({className, ...props}) =>
    <div className={`${className || ''} rounded border border-sky-600 text-sky-700 bg-sky-200`} {...props} />,
  success: ({className, ...props}) =>
    <div className={`${className || ''} rounded border border-green-600 text-green-700 bg-green-100`} {...props} />,
  warning: ({className, ...props}) =>
    <div className={`${className || ''} rounded border border-amber-600 text-amber-700 bg-orange-100`} {...props} />,
}

const Alert = ({ message, children, onDismiss = null, ...props }) => {
  const AlertWrapper = wrappers?.[message?.type || 'info'] || wrappers?.['info'];

  return (
    <AlertWrapper {...props}>
      <div className="flex items-center px-4 py-2">
        {children}
        {message?.content ? <span className="flex-1">{message?.content}</span> : null}
        {onDismiss ? <button onClick={onDismiss} className="hover:opacity-50">
          <FaTimes />
        </button> : null}
      </div>
    </AlertWrapper>
  )
}

export default Alert;