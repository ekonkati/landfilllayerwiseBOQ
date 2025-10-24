
import React, { useState } from 'react';
import { LINER_MATERIALS, INITIAL_LAYERS } from '../constants';
import type { DesignInputs, LinerLayer } from '../types';
import { PlusIcon, TrashIcon, GenerateIcon } from './icons';

interface DesignInputFormProps {
  onGenerate: (inputs: DesignInputs) => void;
  isLoading: boolean;
}

export const DesignInputForm: React.FC<DesignInputFormProps> = ({ onGenerate, isLoading }) => {
  const [area, setArea] = useState<number>(10000);
  const [layers, setLayers] = useState<LinerLayer[]>(INITIAL_LAYERS);

  const handleLayerChange = (id: string, field: keyof Omit<LinerLayer, 'id'>, value: string | number) => {
    setLayers(layers.map(layer => layer.id === id ? { ...layer, [field]: value } : layer));
  };

  const addLayer = () => {
    const newLayer: LinerLayer = {
      id: new Date().getTime().toString(),
      name: "New Layer",
      material: LINER_MATERIALS[0],
      thickness: 150
    };
    setLayers([...layers, newLayer]);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ area, layers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-slate-700">
          Footprint Area (m²)
        </label>
        <input
          type="number"
          id="area"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          min="1"
        />
      </div>

      <div>
        <h3 className="text-md font-medium text-slate-700 mb-2">Liner System Layers</h3>
        <div className="space-y-4">
          {layers.map((layer, index) => (
            <div key={layer.id} className="p-3 border border-slate-200 rounded-md bg-slate-50 relative">
              <p className="text-xs font-semibold text-slate-500 mb-2">Layer {index + 1}</p>
              <div className="space-y-2">
                 <input
                    type="text"
                    placeholder="Layer Name"
                    value={layer.name}
                    onChange={(e) => handleLayerChange(layer.id, 'name', e.target.value)}
                    className="block w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm"
                 />
                 <select
                    value={layer.material}
                    onChange={(e) => handleLayerChange(layer.id, 'material', e.target.value)}
                    className="block w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm"
                  >
                    {LINER_MATERIALS.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                 </select>
                 <input
                    type="number"
                    placeholder="Thickness (mm)"
                    value={layer.thickness}
                    onChange={(e) => handleLayerChange(layer.id, 'thickness', Number(e.target.value))}
                    className="block w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm"
                    min="1"
                  />
              </div>
               <button
                  type="button"
                  onClick={() => removeLayer(layer.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                  aria-label="Remove Layer"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
            </div>
          ))}
        </div>
         <button
          type="button"
          onClick={addLayer}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-dashed border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2 text-slate-500" />
          Add Layer
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <GenerateIcon className="h-5 w-5 mr-2" />
            Generate Design
          </>
        )}
      </button>
    </form>
  );
};
