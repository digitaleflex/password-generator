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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Générateur de Mot de Passe</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform duration-300 transform hover:scale-105">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Longueur du mot de passe</label>
          <input 
            type="number" 
            value={length} 
            onChange={(e) => setLength(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            min="6" 
            max="128"
          />
        </div>
        
        <div className="mb-4 flex items-center">
          <input 
            type="checkbox" 
            checked={hasNumbers} 
            onChange={(e) => setHasNumbers(e.target.checked)} 
            className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 hover:ring-blue-500 transition duration-200"
          />
          <label className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition duration-200">
            Inclure des chiffres
          </label>
        </div>
        
        <div className="mb-4 flex items-center">
          <input 
            type="checkbox" 
            checked={hasSymbols} 
            onChange={(e) => setHasSymbols(e.target.checked)} 
            className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 hover:ring-blue-500 transition duration-200"
          />
          <label className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition duration-200">
            Inclure des symboles
          </label>
        </div>
        
        <button 
          onClick={generatePassword} 
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 font-semibold shadow-md"
        >
          Générer le mot de passe
        </button>
        
        {password && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-inner border border-gray-300">
            <p className="text-lg font-mono text-gray-700">Mot de passe généré :</p>
            <p className="mt-2 text-xl font-bold text-gray-900">{password}</p>
          </div>
        )}
      </div>
    </div>
  );
}
