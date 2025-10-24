
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { DesignInputs, BoQItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const boqSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      item: {
        type: Type.STRING,
        description: 'A short description of the line item.'
      },
      material: {
        type: Type.STRING,
        description: 'The specific material for the item.'
      },
      unit: {
        type: Type.STRING,
        description: 'The unit of measurement (e.g., "sq. m", "cu. m", "kg").'
      },
      quantity: {
        type: Type.NUMBER,
        description: 'The calculated quantity for the item.'
      },
      notes: {
        type: Type.STRING,
        description: 'Any relevant notes or specifications for the item.'
      }
    },
    required: ["item", "material", "unit", "quantity"]
  }
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the `data:image/jpeg;base64,` part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
}

export const generateBoq = async (inputs: DesignInputs): Promise<BoQItem[]> => {
  const layerDescriptions = inputs.layers.map(l => `- ${l.name}: ${l.material}, ${l.thickness}mm thick`).join('\n');
  const prompt = `
    Generate a detailed Bill of Quantities (BoQ) for a landfill liner system with a total footprint area of ${inputs.area} square meters.

    The liner system consists of the following layers, from top to bottom:
    ${layerDescriptions}

    Calculate the quantity for each material.
    - For planar materials like geomembranes, geotextiles, and GCLs, the quantity is the area in square meters. Add a 10% contingency for overlaps and wastage.
    - For soil/aggregate layers like clay, sand, and gravel, the quantity is the volume in cubic meters.
    - The output must be a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: boqSchema,
    },
  });

  const text = response.text.trim();
  try {
    return JSON.parse(text);
  } catch(e) {
    console.error("Failed to parse BoQ JSON:", text);
    throw new Error("The response from the AI was not valid JSON.");
  }
};

const generateImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const firstPart = response.candidates?.[0]?.content?.parts?.[0];
  if (firstPart && firstPart.inlineData) {
    const base64ImageBytes: string = firstPart.inlineData.data;
    return `data:image/png;base64,${base64ImageBytes}`;
  }
  throw new Error("No image was generated.");
};


export const generateCrossSection = async (inputs: DesignInputs): Promise<string> => {
    const layerDescriptions = inputs.layers.map(l => `- ${l.name} (${l.material}, ${l.thickness}mm)`).join('\n');
    const prompt = `
        Create a detailed, clean, and professional 2D technical cross-sectional drawing of a landfill liner system.
        The drawing should clearly label each layer with its name, material, and thickness.
        The style should be a schematic diagram, suitable for an engineering report. Use clear fonts and distinct patterns or colors for each layer.
        Do not include any people or unnecessary background elements. Focus on the technical accuracy of the layers.

        The layers, from top to bottom, are:
        ${layerDescriptions}
    `;
    return generateImage(prompt);
};

export const generate3dModel = async (inputs: DesignInputs): Promise<string> => {
    const layerDescriptions = inputs.layers.map(l => l.name).join(', ');
    const prompt = `
        Create a conceptual 3D model rendering of a modern landfill cell.
        The rendering should show a cutaway view that visualizes the multiple layers of the liner system.
        The overall aesthetic should be clean, professional, and slightly stylized, like an architectural visualization.
        The model should illustrate the overall site utilization and containment structure.
        The liner system includes: ${layerDescriptions}.
        Show the basic geometry of the cell, such as sloped sides.
    `;
    return generateImage(prompt);
};
