// Shape primitives supported by the renderer
export enum ShapeType {
  BOX = 'box',
  SPHERE = 'sphere',
  CYLINDER = 'cylinder',
  CONE = 'cone',
  TORUS = 'torus',
  ICOSAHEDRON = 'icosahedron',
  DODECAHEDRON = 'dodecahedron'
}

export enum MaterialType {
  STANDARD = 'standard',
  PHYSICAL = 'physical',
  NORMAL = 'normal',
  WIREFRAME = 'wireframe'
}

export interface AnimationConfig {
  rotateX?: number; // speed
  rotateY?: number;
  rotateZ?: number;
  float?: boolean;
  pulse?: boolean;
}

export interface SceneObject {
  id: string;
  name: string;
  type: ShapeType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  material: MaterialType;
  roughness: number;
  metalness: number;
  opacity: number;
  animation?: AnimationConfig;
}

export interface SceneLight {
  type: 'ambient' | 'directional' | 'point';
  position?: [number, number, number];
  intensity: number;
  color: string;
}

export interface SceneData {
  title: string;
  description: string;
  objects: SceneObject[];
  lights: SceneLight[];
  backgroundColor: string;
}

export interface GenerationState {
  isGenerating: boolean;
  statusMessage: string;
  error?: string;
}