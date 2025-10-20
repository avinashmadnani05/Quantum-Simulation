import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LiveAnalytics = ({ simulationData = {}, realTimeData = [] }) => {
  const [activeMetric, setActiveMetric] = useState('radius');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [floatingPanels, setFloatingPanels] = useState([]);

  const metrics = [
    { id: 'radius', name: 'Schwarzschild Radius', color: '#00d4ff', unit: 'km' },
    { id: 'temperature', name: 'Hawking Temperature', color: '#8b5cf6', unit: 'K' },
    { id: 'timeDilation', name: 'Time Dilation', color: '#ec4899', unit: 'factor' },
    { id: 'quantum', name: 'Quantum States', color: '#10b981', unit: 'count' }
  ];

  // 3D Chart component
  const Chart3D = ({ data, metric, position = [0, 0, 0] }) => {
    const chartRef = useRef();
    const barsRef = useRef();

    useFrame((state) => {
      if (!chartRef.current || !data) return;

      const time = state.clock.elapsedTime;
      
      // Animate chart based on data
      if (barsRef.current) {
        const values = Object.values(data);
        const maxValue = Math.max(...values);
        
        values.forEach((value, index) => {
          const bar = barsRef.current.children[index];
          if (bar) {
            const normalizedHeight = (value / maxValue) * 2;
            bar.scale.y = normalizedHeight;
            bar.position.y = normalizedHeight / 2;
            
            // Color based on value
            const intensity = value / maxValue;
            bar.material.color.setHSL(0.6, 1, 0.3 + intensity * 0.7);
          }
        });
      }

      // Rotate chart
      chartRef.current.rotation.y = time * 0.1;
    });

    const chartData = useMemo(() => {
      if (!data) return [];
      
      if (metric === 'quantum' && data.counts) {
        return Object.entries(data.counts).map(([state, count]) => ({
          label: state,
          value: count
        }));
      }
      
      return [{ label: metric, value: data[metric] || 0 }];
    }, [data, metric]);

    return (
      <group ref={chartRef} position={position}>
        {/* Chart base */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[2, 2, 0.1, 32]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        
        {/* Chart bars */}
        <group ref={barsRef}>
          {chartData.map((item, index) => (
            <mesh
              key={index}
              position={[
                (index - chartData.length / 2) * 0.4,
                0,
                0
              ]}
            >
              <boxGeometry args={[0.3, 0.1, 0.3]} />
              <meshBasicMaterial color={metrics.find(m => m.id === metric)?.color || '#ffffff'} />
            </mesh>
          ))}
        </group>
        
        {/* Chart labels */}
        {chartData.map((item, index) => (
          <mesh
            key={`label-${index}`}
            position={[
              (index - chartData.length / 2) * 0.4,
              -1.5,
              0
            ]}
          >
            <planeGeometry args={[0.2, 0.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    );
  };

  // Floating data panel
  const FloatingPanel = ({ metric, data, position = [0, 0, 0] }) => {
    const panelRef = useRef();
    const textRef = useRef();

    useFrame((state) => {
      if (!panelRef.current) return;

      const time = state.clock.elapsedTime;
      
      // Float animation
      panelRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1;
      panelRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      
      // Update text content
      if (textRef.current) {
        const value = data[metric] || 0;
        const formattedValue = typeof value === 'number' 
          ? value.toExponential(2) 
          : value.toString();
        textRef.current.material.opacity = 0.8 + Math.sin(time * 2) * 0.2;
      }
    });

    const metricInfo = metrics.find(m => m.id === metric);
    const value = data[metric] || 0;

    return (
      <group ref={panelRef} position={position}>
        {/* Panel background */}
        <mesh>
          <planeGeometry args={[2, 1]} />
          <meshBasicMaterial 
            color={metricInfo?.color || '#ffffff'} 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Panel border */}
        <mesh>
          <planeGeometry args={[2.1, 1.1]} />
          <meshBasicMaterial 
            color={metricInfo?.color || '#ffffff'} 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
        
        {/* Value display */}
        <mesh ref={textRef} position={[0, 0, 0.01]}>
          <planeGeometry args={[1.8, 0.8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    );
  };

  // Real-time data stream visualization
  const DataStream = ({ data, position = [0, 0, 0] }) => {
    const streamRef = useRef();
    const particlesRef = useRef();

    useFrame((state) => {
      if (!streamRef.current || !data) return;

      const time = state.clock.elapsedTime;
      
      // Create flowing data particles
      if (particlesRef.current) {
        const positions = new Float32Array(50 * 3);
        const colors = new Float32Array(50 * 3);
        
        for (let i = 0; i < 50; i++) {
          const t = (i / 50 + time * 0.1) % 1;
          positions[i * 3] = position[0] + (t - 0.5) * 4;
          positions[i * 3 + 1] = position[1] + Math.sin(t * Math.PI * 4) * 0.5;
          positions[i * 3 + 2] = position[2];
          
          // Color based on data value
          const value = data.radius || data.temperature || data.timeDilation || 1;
          const normalizedValue = Math.min(value / 1000, 1);
          const color = new THREE.Color().setHSL(0.6, 1, 0.3 + normalizedValue * 0.7);
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        }
        
        particlesRef.current.geometry.setPositions(positions);
        particlesRef.current.geometry.setColors(colors);
      }
    });

    return (
      <group ref={streamRef} position={position}>
        {/* Data stream line */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={20}
              array={new Float32Array(20 * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" transparent opacity={0.6} />
        </line>
        
        {/* Flowing particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={50}
              array={new Float32Array(50 * 3)}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={50}
              array={new Float32Array(50 * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.05} 
            vertexColors 
            transparent 
            opacity={0.8}
          />
        </points>
      </group>
    );
  };

  // Comparison visualization
  const ComparisonView = ({ data1, data2 }) => {
    const comparisonRef = useRef();

    useFrame((state) => {
      if (!comparisonRef.current) return;

      const time = state.clock.elapsedTime;
      comparisonRef.current.rotation.y = time * 0.05;
    });

    return (
      <group ref={comparisonRef}>
        {/* Side-by-side comparison */}
        <Chart3D data={data1} metric={activeMetric} position={[-3, 0, 0]} />
        <Chart3D data={data2} metric={activeMetric} position={[3, 0, 0]} />
        
        {/* Comparison line */}
        <line position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-3, 0, 0, 3, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffff00" transparent opacity={0.5} />
        </line>
      </group>
    );
  };

  return (
    <group>
      {/* Main analytics display */}
      <Chart3D data={simulationData} metric={activeMetric} position={[0, 0, 0]} />
      
      {/* Floating panels for different metrics */}
      {metrics.map((metric, index) => (
        <FloatingPanel
          key={metric.id}
          metric={metric.id}
          data={simulationData}
          position={[
            Math.cos(index * Math.PI * 2 / metrics.length) * 5,
            2,
            Math.sin(index * Math.PI * 2 / metrics.length) * 5
          ]}
        />
      ))}
      
      {/* Real-time data stream */}
      <DataStream data={simulationData} position={[0, -3, 0]} />
      
      {/* Comparison mode */}
      {comparisonMode && (
        <ComparisonView 
          data1={simulationData} 
          data2={realTimeData[0] || simulationData} 
        />
      )}
      
      {/* Control interface (invisible) */}
      <mesh 
        position={[0, -5, 0]} 
        onClick={() => setActiveMetric(metrics[(metrics.indexOf(metrics.find(m => m.id === activeMetric)) + 1) % metrics.length].id)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
      </mesh>
      
      <mesh 
        position={[1, -5, 0]} 
        onClick={() => setComparisonMode(!comparisonMode)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default LiveAnalytics;
