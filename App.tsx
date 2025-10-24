
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DesignInputForm } from './components/DesignInputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { Spinner } from './components/Spinner';
import { generateBoq, generateCrossSection, generate3dModel } from './services/geminiService';
import type { DesignInputs, BoQItem } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [boqData, setBoqData] = useState<BoQItem[] | null>(null);
  const [crossSectionImage, setCrossSectionImage] = useState<string | null>(null);
  const [model3dImage, setModel3dImage] = useState<string | null>(null);

  const handleGenerateDesign = useCallback(async (inputs: DesignInputs) => {
    setIsLoading(true);
    setError(null);
    setBoqData(null);
    setCrossSectionImage(null);
    setModel3dImage(null);

    try {
      const [boqResult, crossSectionResult, model3dResult] = await Promise.all([
        generateBoq(inputs),
        generateCrossSection(inputs),
        generate3dModel(inputs),
      ]);
      
      setBoqData(boqResult);
      setCrossSectionImage(crossSectionResult);
      setModel3dImage(model3dResult);

    } catch (err) {
      console.error("Error generating design:", err);
      setError("An error occurred while generating the design. Please check the console for details and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-xl font-bold text-slate-700 mb-4">Design Parameters</h2>
              <DesignInputForm onGenerate={handleGenerateDesign} isLoading={isLoading} />
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 min-h-[600px] flex flex-col">
              {isLoading && (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <Spinner />
                  <p className="mt-4 text-slate-500">Generating design assets... this may take a moment.</p>
                </div>
              )}
              {error && (
                <div className="flex-grow flex items-center justify-center text-center">
                   <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Generation Failed!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                  </div>
                </div>
              )}
              {!isLoading && !error && (boqData || crossSectionImage || model3dImage) && (
                <OutputDisplay
                  boqData={boqData}
                  crossSectionImage={crossSectionImage}
                  model3dImage={model3dImage}
                />
              )}
               {!isLoading && !error && !boqData && !crossSectionImage && !model3dImage && (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082a.75.75 0 01.75.75v5.714a2.25 2.25 0 00.659 1.591L14.25 14.5M9.75 3.104a2.25 2.25 0 00-1.632.723L1.5 14.5m12.75 0l.227-.227a.75.75 0 011.061 0l.227.227M14.25 14.5l2.47-2.47a.75.75 0 011.061 0l.227.227M14.25 14.5l-2.47 2.47a.75.75 0 01-1.061 0L9.75 16.25m5.063-4.523l.184.184c.32.32.32.836 0 1.156l-.65 1.768a.75.75 0 01-1.229.468l-1.9-1.9a.75.75 0 01.468-1.229l1.768-.65c.32-.32.836-.32 1.156 0zM17.25 21a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM3.75 21a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Welcome to Landfill-CompliDesign</h3>
                  <p>Enter your design parameters on the left and click "Generate Design" to create your Bill of Quantities, Cross-Section, and 3D Model.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
