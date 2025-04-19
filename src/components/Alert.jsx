import React from 'react';
import PropTypes from 'prop-types';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi'; // Ícones opcionais

const alertStyles = {
  success: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-800',
    icon: FiCheckCircle,
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-800',
    icon: FiXCircle,
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-800',
    icon: FiInfo,
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    icon: FiAlertTriangle,
  },
};

const Alert = ({ message, type = 'info', className = '' }) => {
  if (!message) {
    return null;
  }

  const styles = alertStyles[type] || alertStyles.info;
  const Icon = styles.icon;

  return (
    <div
      className={`flex items-center gap-3 rounded-md border p-4 text-sm ${styles.bg} ${styles.border} ${styles.text} ${className}`}
      role="alert"
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  className: PropTypes.string,
};

export default Alert;