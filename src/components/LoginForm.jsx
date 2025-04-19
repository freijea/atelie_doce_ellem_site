// src/components/LoginForm.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { FcGoogle } from 'react-icons/fc';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Ícones para senha

import Input from './Input';
import Button from './Button';
import Alert from './Alert';

const LoginForm = ({ className = '' }) => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [identifierMask, setIdentifierMask] = useState(''); // Estado para máscara
  const [showPassword, setShowPassword] = useState(false); // Estado para visibilidade da senha

  const handleIdentifierChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove não dígitos
    let currentMask = '';

    if (rawValue.length <= 10 || (rawValue.length === 11 && rawValue.startsWith('0'))) {
        if (rawValue.length <= 10) {
             currentMask = '(99) 9999-9999';
         } else {
             currentMask = '(99) 99999-9999';
         }
    } else if (rawValue.length === 11) {
        currentMask = '999.999.999-99';
    } else {
         currentMask = '999.999.999-99';
    }
    setIdentifierMask(currentMask || '');


    setFormData(prev => ({ ...prev, identifier: e.target.value })); // Atualiza o valor formatado
    if (error) setError(null);
  };


  const handleChange = (e) => { // Handler genérico para outros campos (senha)
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error && typeof error === 'object' && error?.field === name) setError(null); // Limpa erro do campo específico
    else if (error && typeof error === 'string') setError(null); // Limpa erro geral
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null); // Limpa erro anterior
    setSuccessMessage(null);
    setIsLoading(true);

    console.log('Form Data Submitted:', formData);
    setTimeout(() => {
      if (formData.identifier === 'erro@teste.com') {
        setError('Usuário ou senha inválidos.');
      } else if (formData.identifier === 'sucesso@teste.com') {
         setSuccessMessage('Login realizado com sucesso! Redirecionando...');
      } else {
        setError({ field: 'identifier', message: 'CPF ou Celular não encontrado.'}) // Exemplo de erro de campo
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
        <Input
          label="CPF ou Celular"
          type="text" // react-input-mask cuida do tipo
          name="identifier"
          id="identifier"
          placeholder="Digite seu CPF ou nº de celular"
          value={formData.identifier}
          onChange={handleIdentifierChange} // Usa o handler com máscara
          mask={identifierMask} // Passa a máscara dinâmica
          error={identifierError}
          required
          className="mb-4"
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'} // Tipo dinâmico
          name="password"
          id="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange} // Handler genérico
          error={passwordError}
          required
          className="mb-2"
          icon={showPassword ? FiEyeOff : FiEye} // Ícone dinâmico
          onIconClick={togglePasswordVisibility} // Função para o clique no ícone
        />

        {/* ... (Recuperar Senha, Botão Entrar, Divisor, Botões Sociais) ... */}
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
       {/* Separador e Login Social */}
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