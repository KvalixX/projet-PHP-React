import { useState } from 'react';
import { LogIn, Lock, Mail, User, Shield, GraduationCap } from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'professor' | 'student'>('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Test accounts for quick fill
  const testAccounts = [
    { email: 'khalil@univ.ma', password: 'password', role: 'admin' as const },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login(email, password) as UserType;
      
      // Vérifier que le rôle sélectionné correspond au rôle de l'utilisateur
      if (user.role !== selectedRole) {
        setError(`Ce compte est un compte ${getRoleLabel(user.role).toLowerCase()}, pas un compte ${getRoleLabel(selectedRole).toLowerCase()}. Veuillez sélectionner le bon rôle.`);
        setLoading(false);
        return;
      }
      
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'professor':
        return <User className="w-5 h-5" />;
      case 'student':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'professor':
        return 'Professeur';
      case 'student':
        return 'Étudiant';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UniSchedule</h1>
          <p className="text-gray-600">Système de gestion d'emploi du temps</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Connexion
          </h2>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Je me connecte en tant que :
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Shield className={`w-6 h-6 mb-2 ${selectedRole === 'admin' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Administrateur</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('professor');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'professor'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <User className={`w-6 h-6 mb-2 ${selectedRole === 'professor' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Professeur</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'student'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className={`w-6 h-6 mb-2 ${selectedRole === 'student' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Étudiant</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Test Accounts Info */}
          {testAccounts.filter(account => account.role === selectedRole).length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3 font-medium">Compte de test ({getRoleLabel(selectedRole)}):</p>
              <div className="space-y-2">
                {testAccounts
                  .filter(account => account.role === selectedRole)
                  .map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => {
                        setEmail(account.email);
                        setPassword(account.password);
                        setSelectedRole(account.role);
                        setError('');
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(account.role)}
                        <span className="text-gray-700 font-medium">{getRoleLabel(account.role)}</span>
                      </div>
                      <span className="text-gray-500">{account.email}</span>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Cliquez sur un compte pour remplir automatiquement
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 UniSchedule. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}

