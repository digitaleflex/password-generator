"use client";
import { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Home() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [hasSymbols, setHasSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = async () => {
    const res = await fetch(`/api/generate-password?length=${length}&hasNumbers=${hasNumbers}&hasSymbols=${hasSymbols}`);
    const data = await res.json();
    setPassword(data.password);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <h1 className="text-5xl font-bold mb-8 text-gray-800 text-center">Générateur de Mot de Passe</h1>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 transform hover:scale-105">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Longueur du mot de passe</label>
            <input
              type="range"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              min="6"
              max="128"
            />
            <span className="text-sm text-gray-600 mt-1 block text-center">{length} caractères</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="hasNumbers"
              type="checkbox"
              checked={hasNumbers}
              onChange={(e) => setHasNumbers(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasNumbers" className="text-lg font-medium text-gray-700 cursor-pointer">
              Inclure des chiffres
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="hasSymbols"
              type="checkbox"
              checked={hasSymbols}
              onChange={(e) => setHasSymbols(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasSymbols" className="text-lg font-medium text-gray-700 cursor-pointer">
              Inclure des symboles
            </label>
          </div>
          
          <button
            onClick={generatePassword}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 font-semibold shadow-md flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Générer le mot de passe</span>
          </button>
          
          {password && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-inner border border-gray-300 relative">
              <p className="text-lg font-mono text-gray-700">Mot de passe généré :</p>
              <p className="mt-2 text-xl font-bold text-gray-900 break-all">{password}</p>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Copier le mot de passe"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          )}
          
          {copied && (
            <Alert variant="success" className="mt-4">
              <AlertDescription>Mot de passe copié dans le presse-papiers!</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}