
import React from 'react';
import type { BoQItem } from '../types';
import { DownloadIcon } from './icons';

interface BoQTableProps {
  data: BoQItem[];
}

export const BoQTable: React.FC<BoQTableProps> = ({ data }) => {
    
    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + ["Item", "Material", "Unit", "Quantity", "Notes"].join(",") + "\n" 
            + data.map(e => `"${e.item}","${e.material}","${e.unit}",${e.quantity},"${e.notes}"`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bill_of_quantities.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Bill of Quantities</h3>
                <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Material</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Unit</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.item}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.material}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{item.quantity.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.unit}</td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-slate-500 max-w-xs">{item.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
