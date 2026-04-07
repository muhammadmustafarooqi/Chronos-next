import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Watch Assembly
const ProceduralWatch = ({ product }) => {
    const watchRef = useRef();
    const secondHandRef = useRef();
    const minuteHandRef = useRef();
    const hourHandRef = useRef();

    // Dynamically derive colors from the product data
    let baseColor = '#D4AF37'; // Default Gold
    let caseMetalness = 0.9;
    let strapColor = '#e0e5ec'; // Default Steel
    let dialColor = '#111111'; // Default Black
    let caseShape = 'round'; // Dynamic shapes: round, octagon, square

    if (product) {
        const featuresText = product.features?.join(' ').toLowerCase() || '';
        
        // Analyze Case Material
        if (featuresText.includes('steel') || featuresText.includes('titanium') || featuresText.includes('oystersteel')) {
            baseColor = '#e0e5ec'; // Silver/Steel
        }
        if (featuresText.includes('rose gold')) {
            baseColor = '#B76E79'; // Rose Gold
        }
        if (featuresText.includes('ceramic') || featuresText.includes('carbon')) {
            baseColor = '#1a1a1a'; // Black/Ceramic
            caseMetalness = 0.4; // Less metallic
        }

        // Analyze Dial Color (guessing based on common models)
        if (product.name.includes('Submariner') || featuresText.includes('blue')) {
            dialColor = '#003366'; // Blue
        } else if (product.name.includes('Snowflake')) {
            dialColor = '#f0f0f0'; // White/Silver
        } else if (product.brand === 'Patek Philippe') {
            dialColor = '#1F2A38'; // Dark Navy
        }

        // Analyze Strap
        if (featuresText.includes('leather')) {
            strapColor = '#3e2723'; // Dark Brown Leather
        } else if (featuresText.includes('rubber')) {
            strapColor = '#111111'; // Black Rubber
        } else {
            strapColor = baseColor; // Matching metal bracelet
        }

        // Analyze Shape
        if (product.name.includes('Royal Oak')) {
            caseShape = 'octagon';
        } else if (product.name.includes('Tank') || product.name.includes('Santos') || product.name.includes('Reverso') || product.name.includes('Monaco') || featuresText.includes('square')) {
            caseShape = 'square';
        }
    }

    // Premium materials
    const caseMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness: caseMetalness,
        roughness: 0.15,
        envMapIntensity: 2
    });

    const strapMaterial = new THREE.MeshStandardMaterial({
        color: strapColor,
        metalness: strapColor === baseColor ? 0.8 : 0.1, // Less metallic if leather/rubber
        roughness: strapColor === baseColor ? 0.2 : 0.9,
        envMapIntensity: 1.5
    });

    const darkDialMaterial = new THREE.MeshStandardMaterial({
        color: dialColor,
        metalness: 0.5,
        roughness: 0.8,
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        roughness: 0,
        envMapIntensity: 2
    });

    // Animate hands based on real time
    useFrame(() => {
        const date = new Date();
        const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
        const minutes = date.getMinutes() + seconds / 60;
        const hours = (date.getHours() % 12) + minutes / 60;

        if (secondHandRef.current) secondHandRef.current.rotation.y = -Math.PI * 2 * (seconds / 60);
        if (minuteHandRef.current) minuteHandRef.current.rotation.y = -Math.PI * 2 * (minutes / 60);
        if (hourHandRef.current) hourHandRef.current.rotation.y = -Math.PI * 2 * (hours / 12);
        
        // The autoRotate from OrbitControls handles the 360-degree rotation now
        // so we don't need the individual wobble effect.
    });

    return (
        <group ref={watchRef} rotation={[Math.PI / 2, 0, 0]}>
            {/* Main Case */}
            <mesh material={caseMaterial} castShadow receiveShadow>
                {caseShape === 'square' ? (
                    <boxGeometry args={[3.2, 0.5, 4]} />
                ) : caseShape === 'octagon' ? (
                    <cylinderGeometry args={[2.2, 2.2, 0.5, 8]} />
                ) : (
                    <cylinderGeometry args={[2, 2, 0.5, 64]} />
                )}
            </mesh>

            {/* Bezel */}
            <mesh position={[0, 0.25, 0]} material={caseMaterial} castShadow>
                {caseShape === 'square' ? (
                    <boxGeometry args={[3, 0.15, 3.8]} />
                ) : caseShape === 'octagon' ? (
                    <cylinderGeometry args={[2.1, 2.1, 0.15, 8]} />
                ) : (
                    <torusGeometry args={[1.9, 0.15, 32, 64]} />
                )}
            </mesh>

            {/* Dial (Inner background) */}
            <mesh position={[0, 0.26, 0]} material={darkDialMaterial} receiveShadow>
                {caseShape === 'square' ? (
                    <boxGeometry args={[2.8, 0.05, 3.6]} />
                ) : caseShape === 'octagon' ? (
                    <cylinderGeometry args={[2, 2, 0.05, 8]} />
                ) : (
                    <cylinderGeometry args={[1.85, 1.85, 0.05, 64]} />
                )}
            </mesh>

            {/* Hour Markers */}
            {[...Array(12)].map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.sin((i / 12) * Math.PI * 2) * 1.5,
                        0.26,
                        Math.cos((i / 12) * Math.PI * 2) * 1.5
                    ]}
                    rotation={[0, -(i / 12) * Math.PI * 2, 0]}
                    material={caseMaterial}
                >
                    <boxGeometry args={[0.08, 0.02, 0.3]} />
                </mesh>
            ))}

            {/* Sub-dials (Chronograph look) */}
            {[
                [-0.8, 0], // 9 o'clock
                [0.8, 0],  // 3 o'clock
                [0, 0.8]   // 6 o'clock
            ].map((pos, i) => (
                <mesh key={`subdial-${i}`} position={[pos[0], 0.26, pos[1]]} material={caseMaterial}>
                    <cylinderGeometry args={[0.4, 0.4, 0.01, 32]} />
                </mesh>
            ))}

            {/* Hands Wrapper */}
            <group position={[0, 0.35, 0]}>
                {/* Center Pin */}
                <mesh material={caseMaterial}>
                    <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
                </mesh>
                
                {/* Hour Hand */}
                <group ref={hourHandRef}>
                    <mesh position={[0, 0, -0.5]} material={caseMaterial}>
                        <boxGeometry args={[0.1, 0.02, 1]} />
                    </mesh>
                </group>
                
                {/* Minute Hand */}
                <group ref={minuteHandRef}>
                    <mesh position={[0, 0.03, -0.7]} material={caseMaterial}>
                        <boxGeometry args={[0.06, 0.02, 1.4]} />
                    </mesh>
                </group>

                {/* Second Hand (Red/Gold tint, very thin) */}
                <group ref={secondHandRef}>
                    <mesh position={[0, 0.06, -0.8]} material={new THREE.MeshStandardMaterial({ color: '#ff3333', metalness: 0.5 })}>
                        <boxGeometry args={[0.02, 0.02, 1.8]} />
                    </mesh>
                    {/* Counterbalance for second hand */}
                    <mesh position={[0, 0.06, 0.3]} material={new THREE.MeshStandardMaterial({ color: '#ff3333', metalness: 0.5 })}>
                        <boxGeometry args={[0.04, 0.02, 0.4]} />
                    </mesh>
                </group>
            </group>

            {/* Crown (at 3 o'clock) */}
            <mesh position={[2.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={caseMaterial} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
            </mesh>

            {/* Chronometer Pushers (at 2 and 4 o'clock) */}
            <mesh position={[1.8, 0, -1]} rotation={[0, -Math.PI / 6, Math.PI / 2]} material={caseMaterial} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
            </mesh>
            <mesh position={[1.8, 0, 1]} rotation={[0, Math.PI / 6, Math.PI / 2]} material={caseMaterial} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
            </mesh>

            {/* Lugs (Connecting strap to case) */}
            <group>
                <mesh position={[1.2, 0, -1.8]} rotation={[0, Math.PI/4, 0]} material={caseMaterial}>
                    <boxGeometry args={[0.4, 0.4, 0.8]} />
                </mesh>
                <mesh position={[-1.2, 0, -1.8]} rotation={[0, -Math.PI/4, 0]} material={caseMaterial}>
                    <boxGeometry args={[0.4, 0.4, 0.8]} />
                </mesh>
                <mesh position={[1.2, 0, 1.8]} rotation={[0, -Math.PI/4, 0]} material={caseMaterial}>
                    <boxGeometry args={[0.4, 0.4, 0.8]} />
                </mesh>
                <mesh position={[-1.2, 0, 1.8]} rotation={[0, Math.PI/4, 0]} material={caseMaterial}>
                    <boxGeometry args={[0.4, 0.4, 0.8]} />
                </mesh>
            </group>

            {/* Leather/Metal Strap segments */}
            <mesh position={[0, -0.1, -2.5]} rotation={[0.2, 0, 0]} material={strapMaterial} castShadow>
                <boxGeometry args={[1.8, 0.2, 1.5]} />
            </mesh>
            <mesh position={[0, -0.3, -3.8]} rotation={[0.4, 0, 0]} material={strapMaterial} castShadow>
                <boxGeometry args={[1.8, 0.2, 1.3]} />
            </mesh>
            
            <mesh position={[0, -0.1, 2.5]} rotation={[-0.2, 0, 0]} material={strapMaterial} castShadow>
                <boxGeometry args={[1.8, 0.2, 1.5]} />
            </mesh>
            <mesh position={[0, -0.3, 3.8]} rotation={[-0.4, 0, 0]} material={strapMaterial} castShadow>
                <boxGeometry args={[1.8, 0.2, 1.3]} />
            </mesh>

            {/* Sapphire Crystal Glass Overlay */}
            <mesh position={[0, 0.5, 0]} material={glassMaterial}>
                {caseShape === 'square' ? (
                    <boxGeometry args={[2.9, 0.05, 3.7]} />
                ) : caseShape === 'octagon' ? (
                    <cylinderGeometry args={[2, 2, 0.05, 8]} />
                ) : (
                    <cylinderGeometry args={[1.95, 1.95, 0.05, 64]} />
                )}
            </mesh>
        </group>
    );
};

const WatchModel3D = ({ product, className = "" }) => {
    return (
        <div className={`w-full h-full relative cursor-grab active:cursor-grabbing ${className}`}>
            <Canvas camera={{ position: [0, 4, 6], fov: 45 }} shadows dpr={[1, 2]}>
                {/* Advanced Luxury Studio Lighting Setup */}
                <ambientLight intensity={1.5} />
                
                {/* Key light - sharp bright highlight */}
                <spotLight position={[10, 15, 10]} angle={0.2} penumbra={0.5} intensity={5} castShadow shadow-bias={-0.0001} />
                
                {/* Fill light - softer, colored slightly cool for metal contrast */}
                <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={2} color="#f0f5ff" />
                <spotLight position={[0, -10, 10]} intensity={1} color="#ffffff" />
                
                {/* Very close point lights to guarantee sharp specular reflections on the bezel/glass */}
                <pointLight position={[2, 2, 2]} intensity={2} distance={10} />
                <pointLight position={[-2, 1, 3]} intensity={1.5} distance={10} color="#ffeedd" />
                
                <Float rotationIntensity={0.2} floatIntensity={0.5} speed={1.5}>
                    <ProceduralWatch product={product} />
                </Float>

                {/* Soft shadows directly under the floating object */}
                <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={15} blur={2.5} far={4} />

                {/* HDRI Environment for realistic reflections */}
                <Environment preset="studio" background blur={0.8} />
                
                {/* 360 Degree OrbitControls with continuous Auto-Rotation */}
                <OrbitControls 
                    enableZoom={true} 
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={2}
                    minDistance={3}
                    maxDistance={12}
                    makeDefault 
                />
            </Canvas>
            
            {/* Interactive hint overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <span className="bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-white/60 px-4 py-1.5 rounded-full">
                    Drag to inspect 3D model
                </span>
            </div>
        </div>
    );
};

export default WatchModel3D;
