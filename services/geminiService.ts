import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SceneData } from "../types";

// Schema Definition matching the TypeScript interfaces
const sceneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Short title of the generated scene" },
    description: { type: Type.STRING, description: "Short explanation of what was generated" },
    backgroundColor: { type: Type.STRING, description: "Hex color code for the background" },
    lights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["ambient", "directional", "point"] },
          position: { 
            type: Type.ARRAY, 
            items: { type: Type.NUMBER },
            description: "[x, y, z] coordinates. Required for directional/point."
          },
          intensity: { type: Type.NUMBER },
          color: { type: Type.STRING, description: "Hex color" }
        },
        required: ["type", "intensity", "color"]
      }
    },
    objects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { 
            type: Type.STRING, 
            enum: ["box", "sphere", "cylinder", "cone", "torus", "icosahedron", "dodecahedron"] 
          },
          position: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "[x, y, z]" },
          rotation: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "[x, y, z] in radians" },
          scale: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "[x, y, z]" },
          color: { type: Type.STRING, description: "Hex color" },
          material: { 
            type: Type.STRING, 
            enum: ["standard", "physical", "normal", "wireframe"],
            description: "Use 'standard' for most objects, 'physical' for metals/glass."
          },
          roughness: { type: Type.NUMBER, description: "0.0 to 1.0" },
          metalness: { type: Type.NUMBER, description: "0.0 to 1.0" },
          opacity: { type: Type.NUMBER, description: "0.0 to 1.0" },
          animation: {
            type: Type.OBJECT,
            properties: {
              rotateX: { type: Type.NUMBER, description: "Rotation speed factor (e.g., 0.01)" },
              rotateY: { type: Type.NUMBER },
              rotateZ: { type: Type.NUMBER },
              float: { type: Type.BOOLEAN, description: "If true, object bobs up and down" },
              pulse: { type: Type.BOOLEAN, description: "If true, object scales in and out slightly" }
            }
          }
        },
        required: ["id", "type", "position", "rotation", "scale", "color", "material"]
      }
    }
  },
  required: ["title", "description", "objects", "lights", "backgroundColor"]
};

export const generateSceneFromPrompt = async (prompt: string): Promise<SceneData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are a 3D scene architect. Your goal is to visualize the user's prompt by composing a 3D scene using primitive shapes (box, sphere, cylinder, etc.).
    
    GUIDELINES:
    1. CREATIVITY: Since you can only use primitives, you must be creative. Build complex objects by stacking, rotating, and scaling multiple primitives. 
       - Example: To make a "Tree", use a brown cylinder for the trunk and multiple green spheres or cones for leaves.
       - Example: To make a "Car", use boxes for the body and cylinders (rotated 90deg) for wheels.
    2. SCALE: Keep the scene centered around (0,0,0). Normal object size is around 1 unit.
    3. MATERIALS: Use roughness and metalness to convey texture. High metalness for robots, low roughness for plastic.
    4. ANIMATION: Add subtle animations (rotateY for spinning, float for hovering) to make the scene alive.
    5. LIGHTING: Always provide good lighting (usually a mix of ambient and directional) so shapes are visible.
    6. COMPOSITION: Do not just place one object. If the user asks for a "forest", generate multiple trees.
    
    Return ONLY the JSON object matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: sceneSchema,
        temperature: 0.4, // Lower temperature for more stable structural generation
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text generated");
    
    const data = JSON.parse(text) as SceneData;
    return data;
    
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};