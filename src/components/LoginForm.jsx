'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Para o link "Recuperar senha"
import PropTypes from 'prop-types';
import { FcGoogle } from 'react-icons/fc'; // Ícone Google
import { FaInstagram, FaTiktok } from 'react-icons/fa'; // Ícones Instagram e TikTok

import Input from './Input';
import Button from './Button';
import Alert from './Alert';

const LoginForm = ({ className = '' }) => {
  // --- Placeholder State ---
  // No futuro, gerenciar inputs, loading, erros e sucesso com useState/useReducer
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(null); // Ex: 'Credenciais inválidas' ou { field: 'identifier', message: 'CPF/Celular inválido' }
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // -------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro ao digitar
    if (error) setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null); // Limpa erro anterior
    setSuccessMessage(null);
    setIsLoading(true);

    console.log('Form Data Submitted:', formData);
    // --- Placeholder Logic ---
    // Aqui viria a lógica de chamada de API para /api/login ou serviço de auth
    // Exemplo de como definir erro/sucesso (simulado):
    setTimeout(() => {
      if (formData.identifier === 'erro@teste.com') {
        setError('Usuário ou senha inválidos.');
      } else if (formData.identifier === 'sucesso@teste.com') {
         setSuccessMessage('Login realizado com sucesso! Redirecionando...');
         // Redirecionar após sucesso...
      } else {
        setError({ field: 'identifier', message: 'CPF ou Celular não encontrado.'}) // Exemplo de erro de campo
      }
      setIsLoading(false);
    }, 1500);
    // -------------------------
  };

  const handleSocialLogin = (provider) => {
    console.log(`Attempting social login with ${provider}`);
    // --- Placeholder Logic ---
    // Aqui viria a lógica para iniciar o fluxo OAuth com o provider
    // (ex: redirecionar para a página de login do Google/Insta/TikTok)
    // Isso geralmente envolve bibliotecas como NextAuth.js ou chamadas de API específicas.
    // -------------------------
     setError(`Login com ${provider} ainda não implementado.`);
     setTimeout(() => setError(null), 3000);
  };

  // Determina se o erro é específico de um campo ou geral
  const identifierError = typeof error === 'object' && error?.field === 'identifier' ? error.message : null;
  const passwordError = typeof error === 'object' && error?.field === 'password' ? error.message : null;
  const generalError = typeof error === 'string' ? error : null;


  return (
    <div className={`w-full max-w-md p-6 md:p-8 bg-white rounded-default shadow-lg ${className}`}>
      {/* Mensagem Geral de Erro/Sucesso */}
      {generalError && <Alert type="error" message={generalError} className="mb-4" />}
      {successMessage && <Alert type="success" message={successMessage} className="mb-4" />}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="CPF ou Celular"
          type="text" // Pode ser "tel" ou ter máscara no futuro
          name="identifier"
          id="identifier"
          placeholder="Digite seu CPF ou nº de celular"
          value={formData.identifier}
          onChange={handleChange}
          error={identifierError} // Passa a mensagem de erro específica
          required
          className="mb-4" // Ajuste de espaçamento
        />

        <Input
          label="Senha"
          type="password"
          name="password"
          id="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange}
          error={passwordError}
          required
          className="mb-2" // Menos espaço antes de "recuperar senha"
        />

        <div className="text-right mb-6">
          <Link href="/recuperar-senha" // Criar esta página/rota depois
            className="text-sm font-medium text-primary hover:underline"
          >
            Recuperar senha
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading} // Desabilita botão durante carregamento
        >
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
         {/* Google Button */}
         <Button
           variant="secondary" // Ou crie um estilo 'outline' ou 'social'
           onClick={() => handleSocialLogin('Google')}
           className="flex-1 flex items-center justify-center gap-2 !bg-white !text-text-main border border-gray-300 hover:!bg-gray-100" // Exemplo de override de estilo
         >
            <FcGoogle size={20} /> Google
         </Button>
         {/* Instagram Button */}
          <Button
           variant="secondary"
           onClick={() => handleSocialLogin('Instagram')}
           className="flex-1 flex items-center justify-center gap-2 !bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90" // Exemplo de override de estilo
         >
            <FaInstagram size={20} /> Instagram
         </Button>
         {/* TikTok Button */}
         <Button
           variant="secondary"
           onClick={() => handleSocialLogin('TikTok')}
            className="flex-1 flex items-center justify-center gap-2 !bg-black text-white hover:!bg-gray-800" // Exemplo de override de estilo
         >
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