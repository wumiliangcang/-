import { SceneData, ShapeType, MaterialType } from "./types";

export const DEFAULT_SCENE: SceneData = {
  title: "Welcome to GenShape",
  description: "Enter a prompt to generate a 3D scene.",
  backgroundColor: "#101010",
  lights: [
    { type: 'ambient', intensity: 0.5, color: '#ffffff' },
    { type: 'directional', position: [5, 5, 5], intensity: 1, color: '#ffffff' },
    { type: 'point', position: [-5, -5, -5], intensity: 0.5, color: '#ff0000' }
  ],
  objects: [
    {
      id: 'demo-cube',
      name: 'Spinning Cube',
      type: ShapeType.BOX,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1.5, 1.5, 1.5],
      color: '#6366f1',
      material: MaterialType.STANDARD,
      roughness: 0.2,
      metalness: 0.8,
      opacity: 1,
      animation: {
        rotateY: 0.01,
        rotateX: 0.005,
        float: true
      }
    }
  ]
};

export const SUGGESTED_PROMPTS = [
  "A futuristic cyberpunk skyscraper with neon accents",
  "A low-poly tree with pink leaves in spring",
  "A retro arcade machine with glowing screen",
  "A solar system model with planets orbiting",
  "A cute robot made of rounded shapes",
  "An abstract sculpture representing chaos and order"
];