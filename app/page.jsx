"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, Save, Trash2, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';



export default function Home() {
  const [passwords, setPasswords] = useState([{ value: '', length: 12, hasNumbers: false, hasSymbols: false, hasUppercase: false }]);
  const [customSymbols, setCustomSymbols] = useState('!@#$%^&*()_+-=[]{}|;:,.<>?');
  const [copied, setCopied] = useState(false);
  const [showPasswords, setShowPasswords] = useState(Array(1).fill(false));
  const [error, setError] = useState(null);
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  const generatePasswords = async () => {
    setError(null);
    try {
      const newPasswords = await Promise.all(passwords.map(async (pass) => {
        const res = await fetch(`/api/generate-password?length=${pass.length}&hasNumbers=${pass.hasNumbers}&hasSymbols=${pass.hasSymbols}&hasUppercase=${pass.hasUppercase}&customSymbols=${encodeURIComponent(customSymbols)}`);
        if (!res.ok) throw new Error('Erreur lors de la génération du mot de passe.');
        const data = await res.json();
        return { ...pass, value: data.password };
      }));
      setPasswords(newPasswords);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = (password) => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savePasswords = () => {
    const newSavedPasswords = passwords.map(pass => ({ password: pass.value, date: new Date().toLocaleString() }));
    setSavedPasswords([...savedPasswords, ...newSavedPasswords]);
  };

  const deletePassword = (index) => {
    const newSavedPasswords = [...savedPasswords];
    newSavedPasswords.splice(index, 1);
    setSavedPasswords(newSavedPasswords);
  };

  const addPasswordField = () => {
    setPasswords([...passwords, { value: '', length: 12, hasNumbers: false, hasSymbols: false, hasUppercase: false }]);
    setShowPasswords([...showPasswords, false]);
  };

  const removePasswordField = (index) => {
    const newPasswords = [...passwords];
    newPasswords.splice(index, 1);
    setPasswords(newPasswords);
    const newShowPasswords = [...showPasswords];
    newShowPasswords.splice(index, 1);
    setShowPasswords(newShowPasswords);
  };

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (new RegExp(`[${customSymbols}]`).test(password)) strength += 20;
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength <= 20) return "Très faible";
    if (strength <= 40) return "Faible";
    if (strength <= 60) return "Moyen";
    if (strength <= 80) return "Fort";
    return "Très fort";
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const comparePasswords = () => {
    const uniquePasswords = new Set(passwords.map(p => p.value));
    const isUnique = uniquePasswords.size === passwords.length;
    const strengths = passwords.map(p => calculateStrength(p.value));
    const averageStrength = strengths.reduce((a, b) => a + b, 0) / strengths.length;
    setComparisonResult({ isUnique, averageStrength });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <h1 className="text-5xl font-bold mb-8 text-gray-800 text-center">Générateur de Mots de Passe</h1>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transition-all duration-300 transform hover:scale-105">
        <div className="space-y-6">
          {passwords.map((pass, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Mot de passe {index + 1}</h3>
                {index > 0 && (
                  <Button variant="ghost" size="icon" onClick={() => removePasswordField(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Longueur: {pass.length}</label>
                <Slider
                  value={[pass.length]}
                  onValueChange={(value) => {
                    const newPasswords = [...passwords];
                    newPasswords[index].length = value[0];
                    setPasswords(newPasswords);
                  }}
                  min={6}
                  max={128}
                  step={1}
                  className="w-full"
                />
              </div>

              {['Chiffres', 'Symboles', 'Majuscules'].map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center justify-between mt-2">
                  <label htmlFor={`has${option}${index}`} className="text-sm font-medium text-gray-700">
                    Inclure des {option.toLowerCase()}
                  </label>
                  <Switch
                    id={`has${option}${index}`}
                    checked={optionIndex === 0 ? pass.hasNumbers : optionIndex === 1 ? pass.hasSymbols : pass.hasUppercase}
                    onCheckedChange={(checked) => {
                      const newPasswords = [...passwords];
                      if (optionIndex === 0) newPasswords[index].hasNumbers = checked;
                      else if (optionIndex === 1) newPasswords[index].hasSymbols = checked;
                      else newPasswords[index].hasUppercase = checked;
                      setPasswords(newPasswords);
                    }}
                  />
                </div>
              ))}

              {pass.value && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-inner border border-gray-300 relative">
                  <div className="flex items-center mt-2">
                    <p className="text-xl font-bold text-gray-900 break-all mr-2">
                      {showPasswords[index] ? pass.value : '•'.repeat(pass.value.length)}
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newShowPasswords = [...showPasswords];
                              newShowPasswords[index] = !newShowPasswords[index];
                              setShowPasswords(newShowPasswords);
                            }}
                          >
                            {showPasswords[index] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {showPasswords[index] ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(pass.value)}
                          >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copied ? "Copié !" : "Copier le mot de passe"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="mt-2">
                    <Progress value={calculateStrength(pass.value)} className={`w-full ${getPasswordStrengthColor(calculateStrength(pass.value))}`} />
                    <p className="text-xs text-gray-500 mt-1">
                      {getPasswordStrengthLabel(calculateStrength(pass.value))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button onClick={addPasswordField} className="w-full mt-4">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un mot de passe
          </Button>

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

          <Button onClick={generatePasswords} className="w-full">
            <RefreshCw className="w-5 h-5 mr-2" />
            Générer les mots de passe
          </Button>

          <Button onClick={savePasswords} className="w-full mt-2">
            <Save className="w-5 h-5 mr-2" />
            Sauvegarder les mots de passe
          </Button>

          <Button onClick={comparePasswords} className="w-full mt-2">
            Comparer les mots de passe
          </Button>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          {copied && (
            <Alert className="mt-4">
              <AlertDescription>Mot de passe copié dans le presse-papiers!</AlertDescription>
            </Alert>
          )}

          {comparisonResult && (
            <Alert className="mt-4">
              <AlertDescription>
                Les mots de passe sont {comparisonResult.isUnique ? 'uniques' : 'non uniques'}. 
                Force moyenne : {getPasswordStrengthLabel(comparisonResult.averageStrength)}
              </AlertDescription>
            </Alert>
          )}

          {savedPasswords.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">Voir les mots de passe sauvegardés</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Mots de passe sauvegardés</DialogTitle>
                </DialogHeader>
                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
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
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}