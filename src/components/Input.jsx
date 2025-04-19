import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ id, name, type = 'text', label, placeholder, value, onChange, error, required, className = '' }) => {
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary';
  const baseClasses = 'block w-full px-4 py-2 mt-1 rounded-md shadow-sm focus:ring focus:ring-opacity-50';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-text-main mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`${baseClasses} ${errorClasses}`}
      />
      {typeof error === 'string' && error && ( // Exibe erro textual se for string
          <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // Pode ser booleano ou mensagem
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;