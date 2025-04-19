import React from 'react';
import PropTypes from 'prop-types';

const RadioGroup = ({
  label,           // Rótulo opcional para o grupo
  name,            // Atributo 'name' para os inputs (essencial)
  options,         // Array de objetos { value: string, label: string }
  selectedValue,   // Valor atualmente selecionado (controlado pelo pai)
  onChange,        // Função chamada ao mudar a seleção (passa o novo value)
  className = '',    // Classes CSS para o container do grupo
  radioClassName = '', // Classes CSS para cada par label+input
}) => {

  const handleRadioChange = (event) => {
    onChange(event.target.value); // Chama a função do pai com o novo valor selecionado
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-main mb-2">{label}</label>
      )}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2"> {/* flex-wrap para responsividade */}
        {options.map((option) => (
          <label key={option.value} className={`flex items-center cursor-pointer ${radioClassName}`}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleRadioChange}
              className="form-radio text-primary focus:ring-primary h-4 w-4" // Estilo base do Tailwind Forms
            />
            <span className="ml-2 text-sm text-text-main">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  radioClassName: PropTypes.string,
};

// Nota: Para estilizar o form-radio com Tailwind, pode ser necessário
// instalar e configurar o plugin oficial @tailwindcss/forms:
// npm install -D @tailwindcss/forms
// E adicioná-lo no array `plugins` do seu tailwind.config.js: `plugins: [require('@tailwindcss/forms')]`
// Se não quiser adicionar o plugin, você pode precisar de classes customizadas para o radio button.

export default RadioGroup;