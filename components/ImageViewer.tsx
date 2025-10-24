
import React from 'react';
import { DownloadIcon } from './icons';

interface ImageViewerProps {
  src: string;
  alt: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt }) => {
    const handleExport = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = alt.toLowerCase().replace(/\s+/g, '_') + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{alt}</h3>
                <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export Image
                </button>
            </div>
            <div className="flex-grow bg-slate-100 rounded-lg p-4 flex items-center justify-center overflow-auto">
                <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-md shadow-lg" />
            </div>
        </div>
    );
};
