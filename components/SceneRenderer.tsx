import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Grid, Stars, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SceneData, SceneObject, ShapeType, MaterialType } from '../types';

interface ObjectProps {
  data: SceneObject;
}

const AnimatedObject: React.FC<ObjectProps> = ({ data }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotational animation
    if (data.animation?.rotateX) meshRef.current.rotation.x += data.animation.rotateX;
    if (data.animation?.rotateY) meshRef.current.rotation.y += data.animation.rotateY;
    if (data.animation?.rotateZ) meshRef.current.rotation.z += data.animation.rotateZ;

    // Float animation
    if (data.animation?.float) {
      meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }

    // Pulse animation
    if (data.animation?.pulse) {
      const scaleFactor = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(
        data.scale[0] * scaleFactor,
        data.scale[1] * scaleFactor,
        data.scale[2] * scaleFactor
      );
    }
  });

  const geometryMap = {
    [ShapeType.BOX]: <boxGeometry args={[1, 1, 1]} />,
    [ShapeType.SPHERE]: <sphereGeometry args={[0.5, 32, 32]} />,
    [ShapeType.CYLINDER]: <cylinderGeometry args={[0.5, 0.5, 1, 32]} />,
    [ShapeType.CONE]: <coneGeometry args={[0.5, 1, 32]} />,
    [ShapeType.TORUS]: <torusGeometry args={[0.5, 0.2, 16, 100]} />,
    [ShapeType.ICOSAHEDRON]: <icosahedronGeometry args={[0.5, 0]} />,
    [ShapeType.DODECAHEDRON]: <dodecahedronGeometry args={[0.5, 0]} />,
  };

  const materialProps = {
    color: hovered ? '#ffffff' : data.color,
    roughness: data.roughness ?? 0.5,
    metalness: data.metalness ?? 0.5,
    transparent: (data.opacity ?? 1) < 1,
    opacity: data.opacity ?? 1,
    wireframe: data.material === MaterialType.WIREFRAME
  };

  return (
    <mesh
      ref={meshRef}
      position={data.position}
      rotation={data.rotation as any}
      scale={data.scale}
      castShadow
      receiveShadow
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {geometryMap[data.type]}
      {data.material === MaterialType.PHYSICAL ? (
        <meshPhysicalMaterial {...materialProps} clearcoat={1} clearcoatRoughness={0.1} />
      ) : data.material === MaterialType.NORMAL ? (
        <meshNormalMaterial wireframe={materialProps.wireframe} />
      ) : (
        <meshStandardMaterial {...materialProps} />
      )}
    </mesh>
  );
};

interface SceneRendererProps {
  sceneData: SceneData;
}

const SceneRenderer: React.FC<SceneRendererProps> = ({ sceneData }) => {
  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden bg-neutral-950 shadow-2xl border border-neutral-800">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 8], fov: 50 }}>
        <color attach="background" args={[sceneData.backgroundColor]} />
        
        <group>
          {sceneData.objects.map((obj) => (
            <AnimatedObject key={obj.id} data={obj} />
          ))}
        </group>

        {/* Lighting System based on data */}
        {sceneData.lights.map((light, i) => {
           if (light.type === 'ambient') return <ambientLight key={i} intensity={light.intensity} color={light.color} />;
           if (light.type === 'directional') return <directionalLight key={i} position={light.position} intensity={light.intensity} color={light.color} castShadow />;
           if (light.type === 'point') return <pointLight key={i} position={light.position} intensity={light.intensity} color={light.color} />;
           return null;
        })}

        <Environment preset="city" />
        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        <OrbitControls makeDefault autoRotate={false} />
        <Grid infiniteGrid fadeDistance={30} sectionColor="#4f4f4f" cellColor="#2f2f2f" position={[0, -2, 0]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 text-xs text-neutral-500 font-mono pointer-events-none select-none">
        Interactive 3D Viewport • R3F
      </div>
    </div>
  );
};

export default SceneRenderer;