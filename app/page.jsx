"use client";
import { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/Progress'; // Utiliser l'importation nommée

export default function Home() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [hasSymbols, setHasSymbols] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState(null); // Pour gérer les erreurs de l'API

  const generatePassword = async () => {
    setError(null); // Réinitialiser l'erreur avant chaque requête
    try {
      const res = await fetch(`/api/generate-password?length=${length}&hasNumbers=${hasNumbers}&hasSymbols=${hasSymbols}&hasUppercase=${hasUppercase}`);
      if (!res.ok) throw new Error('Erreur lors de la génération du mot de passe.');
      const data = await res.json();
      setPassword(data.password);
    } catch (err) {
      setError(err.message); // Enregistrer le message d'erreur
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (password) {
      let newStrength = 0;
      if (password.length >= 8) newStrength += 25;
      if (password.length >= 12) newStrength += 25;
      if (/\d/.test(password)) newStrength += 25;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) newStrength += 25;
      setStrength(newStrength);
    }
  }, [password]);

  // Fonction pour déterminer la couleur de la force du mot de passe
  const getPasswordStrengthColor = (strength) => {
    if (strength <= 25) return 'red';     // Faible
    if (strength <= 50) return 'orange';  // Moyen
    if (strength <= 75) return 'yellow';  // Fort
    return 'green';                        // Très fort
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <h1 className="text-5xl font-bold mb-8 text-gray-800 text-center">Générateur de Mot de Passe</h1>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 transform hover:scale-105">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Longueur du mot de passe: {length}</label>
            <input
              type="range"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              min="6"
              max="128"
              aria-label="Longueur du mot de passe"
            />
          </div>

          {['Chiffres', 'Symboles', 'Majuscules'].map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                id={`has${option}`}
                type="checkbox"
                checked={index === 0 ? hasNumbers : index === 1 ? hasSymbols : hasUppercase}
                onChange={(e) => index === 0 ? setHasNumbers(e.target.checked) : index === 1 ? setHasSymbols(e.target.checked) : setHasUppercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label={`Inclure des ${option.toLowerCase()}`}
              />
              <label htmlFor={`has${option}`} className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition duration-200">
                Inclure des {option.toLowerCase()}
              </label>
            </div>
          ))}

          <button
            onClick={generatePassword}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 font-semibold shadow-md flex items-center justify-center space-x-2"
            aria-label="Générer le mot de passe"
          >
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Générer le mot de passe</span>
          </button>

          {error && <p className="text-red-600">{error}</p>} {/* Affichage de l'erreur si nécessaire */}

          {password && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-inner border border-gray-300 relative">
              <p className="text-lg font-mono text-gray-700">Mot de passe généré :</p>
              <div className="flex items-center mt-2">
                <p className="text-xl font-bold text-gray-900 break-all mr-2">
                  {showPassword ? password : '•'.repeat(password.length)}
                </p>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Copier le mot de passe"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          )}

          {password && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Force du mot de passe :</p>
              <Progress value={strength} className="w-full" color={getPasswordStrengthColor(strength)} />
              <p className="text-xs text-gray-500 mt-1">
                {strength <= 25 ? "Faible" : strength <= 50 ? "Moyen" : strength <= 75 ? "Fort" : "Très fort"}
              </p>
            </div>
          )}

          {copied && (
            <Alert variant="success" className="mt-4 animate-fade-out">
              <AlertDescription>Mot de passe copié dans le presse-papiers!</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
