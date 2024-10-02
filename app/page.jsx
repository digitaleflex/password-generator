"use client";
import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Home() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [hasSymbols, setHasSymbols] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState(null);
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [customSymbols, setCustomSymbols] = useState('!@#$%^&*()_+-=[]{}|;:,.<>?');

  const generatePassword = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/generate-password?length=${length}&hasNumbers=${hasNumbers}&hasSymbols=${hasSymbols}&hasUppercase=${hasUppercase}&customSymbols=${encodeURIComponent(customSymbols)}`);
      if (!res.ok) throw new Error('Erreur lors de la génération du mot de passe.');
      const data = await res.json();
      setPassword(data.password);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savePassword = () => {
    setSavedPasswords([...savedPasswords, { password, date: new Date().toLocaleString() }]);
  };

  const deletePassword = (index) => {
    const newSavedPasswords = [...savedPasswords];
    newSavedPasswords.splice(index, 1);
    setSavedPasswords(newSavedPasswords);
  };

  useEffect(() => {
    if (password) {
      let newStrength = 0;
      if (password.length >= 8) newStrength += 25;
      if (password.length >= 12) newStrength += 25;
      if (/\d/.test(password)) newStrength += 25;
      if (new RegExp(`[${customSymbols}]`).test(password)) newStrength += 25;
      setStrength(newStrength);
    }
  }, [password, customSymbols]);

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <h1 className="text-5xl font-bold mb-8 text-gray-800 text-center">Générateur de Mot de Passe</h1>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 transform hover:scale-105">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Longueur du mot de passe: {length}</label>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={6}
              max={128}
              step={1}
              className="w-full"
            />
          </div>

          {['Chiffres', 'Symboles', 'Majuscules'].map((option, index) => (
            <div key={index} className="flex items-center justify-between">
              <label htmlFor={`has${option}`} className="text-lg font-medium text-gray-700">
                Inclure des {option.toLowerCase()}
              </label>
              <Switch
                id={`has${option}`}
                checked={index === 0 ? hasNumbers : index === 1 ? hasSymbols : hasUppercase}
                onCheckedChange={(checked) => index === 0 ? setHasNumbers(checked) : index === 1 ? setHasSymbols(checked) : setHasUppercase(checked)}
              />
            </div>
          ))}

          <div>
            <label htmlFor="customSymbols" className="block text-sm font-medium text-gray-700 mb-1">
              Symboles personnalisés
            </label>
            <Input
              id="customSymbols"
              value={customSymbols}
              onChange={(e) => setCustomSymbols(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={generatePassword}
            className="w-full"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Générer le mot de passe
          </Button>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          {password && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-inner border border-gray-300 relative">
              <p className="text-lg font-mono text-gray-700">Mot de passe généré :</p>
              <div className="flex items-center mt-2">
                <p className="text-xl font-bold text-gray-900 break-all mr-2">
                  {showPassword ? password : '•'.repeat(password.length)}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="absolute top-2 right-2 flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {copied ? "Copié !" : "Copier le mot de passe"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={savePassword}
                      >
                        <Save className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Sauvegarder le mot de passe
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          {password && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Force du mot de passe :</p>
              <Progress value={strength} className={`w-full ${getPasswordStrengthColor(strength)}`} />
              <p className="text-xs text-gray-500 mt-1">
                {strength <= 25 ? "Faible" : strength <= 50 ? "Moyen" : strength <= 75 ? "Fort" : "Très fort"}
              </p>
            </div>
          )}

          {copied && (
            <Alert className="mt-4">
              <AlertDescription>Mot de passe copié dans le presse-papiers!</AlertDescription>
            </Alert>
          )}

          {savedPasswords.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Mots de passe sauvegardés</h2>
              <ul className="space-y-2">
                {savedPasswords.map((saved, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span className="font-mono">{saved.password.substring(0, 20)}...</span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">{saved.date}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePassword(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}