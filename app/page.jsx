"use client";
import { useState } from 'react';

export default function Home() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [hasSymbols, setHasSymbols] = useState(false);

  const generatePassword = async () => {
    const res = await fetch(`/api/generate-password?length=${length}&hasNumbers=${hasNumbers}&hasSymbols=${hasSymbols}`);
    const data = await res.json();
    setPassword(data.password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Générateur de Mot de Passe</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Longueur du mot de passe</label>
          <input 
            type="number" 
            value={length} 
            onChange={(e) => setLength(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            min="6" 
            max="128"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={hasNumbers} 
              onChange={(e) => setHasNumbers(e.target.checked)} 
              className="mr-2"
            /> Inclure des chiffres
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={hasSymbols} 
              onChange={(e) => setHasSymbols(e.target.checked)} 
              className="mr-2"
            /> Inclure des symboles
          </label>
        </div>
        <button 
          onClick={generatePassword} 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Générer le mot de passe
        </button>
        {password && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-inner">
            <p className="text-lg font-mono text-gray-700">Mot de passe généré :</p>
            <p className="mt-2 text-xl font-bold text-gray-900">{password}</p>
          </div>
        )}
      </div>
    </div>
  );
}
