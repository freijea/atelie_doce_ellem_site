// src/components/Input.jsx
'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';

const Input = ({
    id, name, type = 'text', label, placeholder, value, onChange, error,
    required, className = '', mask, icon: Icon, onIconClick,
    placeholderClassName = '' // <<< NOVA PROP ADICIONADA
}) => {
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary';
  const baseClasses = 'block w-full px-4 py-2 mt-1 rounded-md shadow-sm focus:ring focus:ring-opacity-50';
  const inputPaddingRight = Icon ? 'pr-10' : '';

  const commonProps = {
    type: type,
    id: id || name,
    name: name,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    required: required,
    className: `${baseClasses} ${errorClasses} ${inputPaddingRight} ${placeholderClassName}`, // <<< placeholderClassName ADICIONADA AQUI
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-text-main mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
         {mask ? (
            <IMaskInput {...commonProps} mask={mask} radix="." unmask={false} />
         ) : (
            <input {...commonProps} />
         )}
         {/* ... Ícone ... */}
         {Icon && ( <button type="button" onClick={onIconClick} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary" aria-label={type === 'password' ? 'Mostrar/ocultar senha' : undefined} > <Icon className="h-5 w-5" /> </button> )}
      </div>
      {typeof error === 'string' && error && (
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
  mask: PropTypes.oneOfType([PropTypes.string, PropTypes.any]), // iMask aceita mais tipos, mas string é o principal aqui
  icon: PropTypes.elementType,
  onIconClick: PropTypes.func,
  placeholderClassName: PropTypes.string
};

export default Input;