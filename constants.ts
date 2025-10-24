
import type { LinerLayer } from './types';

export const LINER_MATERIALS: string[] = [
  "Compacted Clay",
  "HDPE Geomembrane",
  "LLDPE Geomembrane",
  "Geosynthetic Clay Liner (GCL)",
  "Non-woven Geotextile",
  "Woven Geotextile",
  "Geocomposite Drainage Layer",
  "Gravel",
  "Sand",
  "Topsoil",
  "Vegetative Layer"
];

export const INITIAL_LAYERS: LinerLayer[] = [
    { id: '1', name: "Protective Soil Cover", material: "Sand", thickness: 300 },
    { id: '2', name: "Leachate Collection Gravel", material: "Gravel", thickness: 300 },
    { id: '3', name: "Geotextile Filter", material: "Non-woven Geotextile", thickness: 5 },
    { id: '4', name: "Primary Geomembrane", material: "HDPE Geomembrane", thickness: 2 },
    { id: '5', name: "Geosynthetic Clay Liner (GCL)", material: "Geosynthetic Clay Liner (GCL)", thickness: 7 },
    { id: '6', name: "Compacted Clay Liner", material: "Compacted Clay", thickness: 600 },
];
