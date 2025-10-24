
import React, { useState } from 'react';
import type { BoQItem } from '../types';
import { BoQTable } from './BoQTable';
import { ImageViewer } from './ImageViewer';
import { BoQIcon, CrossSectionIcon, Model3DIcon } from './icons';

interface OutputDisplayProps {
  boqData: BoQItem[] | null;
  crossSectionImage: string | null;
  model3dImage: string | null;
}

type Tab = 'boq' | 'cross-section' | '3d-model';

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ boqData, crossSectionImage, model3dImage }) => {
  const [activeTab, setActiveTab] = useState<Tab>('boq');

  const tabs = [
    { id: 'boq', name: 'Bill of Quantities', icon: <BoQIcon className="h-5 w-5 mr-2" />, content: boqData ? <BoQTable data={boqData} /> : null },
    { id: 'cross-section', name: 'Cross-Section', icon: <CrossSectionIcon className="h-5 w-5 mr-2" />, content: crossSectionImage ? <ImageViewer src={crossSectionImage} alt="Generated Cross-Section" /> : null },
    { id: '3d-model', name: '3D Model', icon: <Model3DIcon className="h-5 w-5 mr-2" />, content: model3dImage ? <ImageViewer src={model3dImage} alt="Generated 3D Model" /> : null },
  ];

  const availableTabs = tabs.filter(tab => tab.content !== null);
  
  // Set active tab to the first available one if current is not available
  if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id as Tab);
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div>
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  ${tab.id === activeTab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                  whitespace-nowrap flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none
                `}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="py-6 flex-grow overflow-auto">
        {availableTabs.map((tab) => (
          <div key={tab.id} className={`${tab.id === activeTab ? 'block' : 'hidden'} h-full`}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
