import React, { useState } from 'react';
import { AuthService } from '../lib/authService';
import { AuthUser } from '../types';
import { 
  Lock, 
  User, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBackToSite: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Por favor, informe seu usuário ou e-mail e sua senha.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await AuthService.login(identifier, password);
    setLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setError(result.message || 'Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Top Header com botão de voltar */}
      <header className="max-w-6xl w-full mx-auto p-4 sm:p-6 flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Voltar ao Site da Igreja</span>
        </button>

        <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
          Painel de Acesso Seguro • INA Esperança
        </span>
      </header>

      {/* Conteúdo Central */}
      <main className="max-w-md w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Card do Formulário de Login */}
        <div className="bg-zinc-900/90 border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
          
          {/* Logo e Cabeçalho */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto flex items-center justify-center p-1">
              <img 
                src="/logo.png" 
                alt="Logo Nova Aliança Esperança" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_12px_rgba(29,78,216,0.6)]" 
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Painel de Gestão Interna
            </h1>
            
            <p className="text-xs text-zinc-400">
              Acesso exclusivo para Liderança, Pastores, Supervisores e Ministérios.
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Usuário / E-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">
                Usuário ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="Digite seu usuário ou e-mail..."
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl pl-10 pr-3.5 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite sua senha..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl pl-10 pr-10 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-sm font-bold shadow-lg shadow-blue-950/60 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Validando acesso...' : 'Entrar no Painel'}
            </button>
          </form>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto p-4 text-center text-xs text-zinc-600">
        <p>&copy; {new Date().getFullYear()} Igreja Nova Aliança Esperança — Acesso Restrito</p>
      </footer>

    </div>
  );
};
