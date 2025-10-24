
export interface LinerLayer {
  id: string;
  name: string;
  material: string;
  thickness: number; // in mm
}

export interface DesignInputs {
  area: number; // in sq meters
  layers: LinerLayer[];
}

export interface BoQItem {
  item: string;
  material: string;
  unit: string;
  quantity: number;
  notes: string;
}
