
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') setError('Usuário não encontrado.');
      else if (err.code === 'auth/wrong-password') setError('Senha incorreta.');
      else if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está em uso.');
      else setError('Erro ao acessar o sistema. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setError('Falha ao conectar com o Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-[100] overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden animate-scaleIn my-8">
        <div className="bg-indigo-600/10 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
          
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-indigo-500/20">
             <div className="text-white text-[12px] font-black px-2 py-1">PRO</div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight relative z-10">Starlink Pro</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium relative z-10 uppercase tracking-widest text-[10px]">Cloud Sync Enterprise</p>
        </div>
        
        <div className="p-8 sm:p-10 space-y-6">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-800 border border-slate-700 rounded-2xl font-bold text-slate-200 hover:bg-slate-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <GoogleIcon />
            {isLoading ? 'Conectando...' : 'Entrar com Google'}
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ou use sua conta</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl text-xs font-bold text-center border border-rose-500/20 animate-fadeIn">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">E-mail</label>
              <input 
                type="email"
                required
                disabled={isLoading}
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all placeholder:text-slate-600"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Senha</label>
              <input 
                type="password"
                required
                disabled={isLoading}
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-slate-200 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>}
              {isRegistering ? 'Criar Conta' : 'Acessar Painel'}
            </button>
          </form>

          <div className="text-center">
             <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
             >
                {isRegistering ? 'Já tenho conta? Login' : 'Não tem conta? Cadastre-se'}
             </button>
          </div>
          
          <div className="pt-4 text-center">
            <p className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em] leading-relaxed">
              Infraestrutura Cloud <br/> Starlink Global Inventory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default Login;
