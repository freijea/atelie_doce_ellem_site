// src/components/LoginForm.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { FcGoogle } from 'react-icons/fc';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import Input from './Input';
import Button from './Button';
import Alert from './Alert';
import RadioGroup from './RadioGroup'; // <<< IMPORTAR O NOVO COMPONENTE

const LoginForm = ({ className = '' }) => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [idType, setIdType] = useState('phone');

  // Define máscara, label e placeholder baseado no tipo selecionado
  const identifierConfig = {
    phone: {
      // Máscara dinâmica para 8 ou 9 dígitos no celular
      mask: '(00) 90000-0000', // IMask lida com o 9º dígito opcional com '9'
      label: 'Celular',
      placeholder: '(xx) 9xxxx-xxxx',
    },
    cpf: {
      mask: '000.000.000-00',
      label: 'CPF',
      placeholder: 'xxx.xxx.xxx-xx',
    }
  };

  const currentConfig = identifierConfig[idType];

  // Define as opções para o RadioGroup
  const idOptions = [
    { value: 'phone', label: 'Celular' },
    { value: 'cpf', label: 'CPF' }
  ];

  // Handler SIMPLIFICADO para o Input de identificador
  const handleIdentifierChange = (e) => {
    setFormData(prev => ({ ...prev, identifier: e.target.value }));
    if (error) setError(null);
  };

  // Ajustado para receber o valor diretamente do RadioGroup
  const handleIdTypeChange = (newValue) => {
    setIdType(newValue);
    setFormData(prev => ({ ...prev, identifier: '' }));
    setError(null);
  };

  const handleChange = (e) => { // Handler para senha
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error && typeof error === 'object' && error?.field === name) setError(null);
    else if (error && typeof error === 'string') setError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

   const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    console.log('Form Data Submitted:', { ...formData, identifierType: idType }); // Inclui o tipo no log
    setTimeout(() => {
      // Mantenha a lógica de erro/sucesso simulada por enquanto
      if (idType === 'cpf' && formData.identifier.includes('111')) { // Exemplo erro CPF
           setError({ field: 'identifier', message: 'CPF inválido.'})
      } else if (idType === 'phone' && formData.identifier.includes('5555')) { // Exemplo erro Celular
           setError({ field: 'identifier', message: 'Celular não encontrado.'})
      }
       else {
         setSuccessMessage('Login realizado com sucesso! Redirecionando...');
      }
      setIsLoading(false);
    }, 1500);
  };

   const handleSocialLogin = (provider) => {
    console.log(`Attempting social login with ${provider}`);
     setError(`Login com ${provider} ainda não implementado.`);
     setTimeout(() => setError(null), 3000);
   };


  const identifierError = typeof error === 'object' && error?.field === 'identifier' ? error.message : null;
  const passwordError = typeof error === 'object' && error?.field === 'password' ? error.message : null;
  const generalError = typeof error === 'string' ? error : null;


  return (
    <div className={`w-full max-w-md p-6 md:p-8 bg-white rounded-default shadow-lg ${className}`}>
      {generalError && <Alert type="error" message={generalError} className="mb-4" />}
      {successMessage && <Alert type="success" message={successMessage} className="mb-4" />}

      <form onSubmit={handleSubmit} noValidate>

        {/* --- SUBSTITUI Bloco de Radio Buttons pelo Componente --- */}
        <RadioGroup
          label="Entrar com:"
          name="idType"
          options={idOptions}
          selectedValue={idType}
          onChange={handleIdTypeChange} // Passa a função ajustada
          className="mb-4" // Adiciona margem inferior ao grupo
        />
        {/* --- Fim da Substituição --- */}
        
        <Input
          label={currentConfig.label} // Label dinâmica
          type="text" // IMask cuida do formato
          name="identifier"
          id="identifier"
          placeholder={currentConfig.placeholder} // Placeholder dinâmico
          value={formData.identifier}
          onChange={handleIdentifierChange} // Handler SIMPLES agora
          mask={currentConfig.mask} // Máscara baseada no tipo selecionado
          error={identifierError}
          required
          className="mb-4"
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange}
          error={passwordError}
          required
          className="mb-2"
          icon={showPassword ? FiEyeOff : FiEye}
          onIconClick={togglePasswordVisibility}
        />

        {/* ... (Restante do form: Recuperar Senha, Botão Entrar, etc.) ... */}
         <div className="text-right mb-6">
          <Link href="/recuperar-senha"
            className="text-sm font-medium text-primary hover:underline"
          >
            Recuperar senha
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      {/* ... (Restante: Divisor, Botões Sociais) ... */}
      <div className="my-6 flex items-center justify-center">
        <span className="border-t border-gray-300 flex-grow"></span>
        <span className="px-4 text-sm text-gray-500">Ou entre com</span>
        <span className="border-t border-gray-300 flex-grow"></span>
      </div>

       <div className="flex flex-col sm:flex-row gap-3 justify-center">
         <Button variant="secondary" onClick={() => handleSocialLogin('Google')} className="flex-1 flex items-center justify-center gap-2 !bg-white !text-text-main border border-gray-300 hover:!bg-gray-100" >
            <FcGoogle size={20} /> Google
         </Button>
          <Button variant="secondary" onClick={() => handleSocialLogin('Instagram')} className="flex-1 flex items-center justify-center gap-2 !bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90" >
            <FaInstagram size={20} /> Instagram
         </Button>
         <Button variant="secondary" onClick={() => handleSocialLogin('TikTok')} className="flex-1 flex items-center justify-center gap-2 !bg-black text-white hover:!bg-gray-800" >
            <FaTiktok size={20} /> TikTok
         </Button>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  className: PropTypes.string,
};

export default LoginForm;