import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SiDjango,
  SiReact,
  SiThreedotjs,
  SiUnrealengine,
  SiAndroidstudio,
  SiAmazonec2,
  SiExpo,
  SiFirebase
} from 'react-icons/si';
import { FaGithub, FaTimes } from 'react-icons/fa';
import './NodeCanvas.css';

// Node dimensions
const NODE_WIDTH = 150;
const NODE_HEIGHT = 65;

// Node descriptions and details
const nodeDetails = {
  react: {
    description: 'A JavaScript library for building user interfaces. React makes it painless to create interactive UIs with component-based architecture.',
    skills: ['Component Development', 'State Management', 'Hooks', 'Virtual DOM'],
    output: 'Modern, responsive web applications with reusable UI components'
  },
  django: {
    description: 'A high-level Python web framework that encourages rapid development and clean, pragmatic design. Perfect for building robust backend systems.',
    skills: ['REST APIs', 'ORM', 'Authentication', 'Admin Panel'],
    output: 'Scalable backend services, REST APIs, and database management'
  },
  reactnative: {
    description: 'Build native mobile apps using React. With Expo, development becomes even faster with managed workflow and easy deployment.',
    skills: ['Cross-platform Development', 'Native Components', 'Expo SDK', 'Mobile UI'],
    output: 'iOS and Android applications from a single codebase'
  },
  threejs: {
    description: 'A powerful 3D graphics library that makes WebGL simpler. Create stunning 3D visualizations, games, and interactive experiences.',
    skills: ['3D Modeling', 'WebGL', 'Animations', 'Shaders'],
    output: 'Immersive 3D web experiences and visualizations'
  },
  unreal: {
    description: 'A complete suite for game development. Industry-standard engine for creating high-quality games and real-time 3D experiences.',
    skills: ['Blueprints', 'C++', 'Level Design', 'Game Mechanics'],
    output: 'High-performance games and interactive 3D applications'
  },
  github: {
    description: 'Version control and collaboration platform. Essential for managing code, tracking changes, and working with teams on projects.',
    skills: ['Git', 'Version Control', 'CI/CD', 'Collaboration'],
    output: 'Organized codebase, automated workflows, and team collaboration'
  },
  android: {
    description: 'Official IDE for Android development. Build native Android applications with Kotlin/Java and access to all Android APIs.',
    skills: ['Kotlin', 'Java', 'Android SDK', 'Material Design'],
    output: 'Native Android applications with full platform capabilities'
  },
  firebase: {
    description: 'Google\'s platform for building mobile and web applications. Provides hosting, authentication, database, and more.',
    skills: ['Realtime Database', 'Authentication', 'Cloud Functions', 'Hosting'],
    output: 'Deployed web apps with backend services and real-time features'
  },
  aws: {
    description: 'Amazon Web Services EC2 provides scalable computing capacity. Combined with CI/CD for automated deployment pipelines.',
    skills: ['EC2 Instances', 'S3 Storage', 'CI/CD Pipelines', 'Auto Scaling'],
    output: 'Production-ready applications with automated deployment'
  }
};

// Skills flow structure
const initialNodes = [
  { id: 'react', x: 50, y: 30, title: 'React', subtitle: 'Frontend Framework', type: 'trigger', category: 'react' },
  { id: 'django', x: 340, y: 30, title: 'Django', subtitle: 'Backend Framework', type: 'trigger', category: 'backend' },
  { id: 'reactnative', x: 630, y: 30, title: 'React Native', subtitle: '+ Expo', type: 'trigger', category: 'reactnative' },
  { id: 'threejs', x: 260, y: 170, title: 'Three.js', subtitle: '3D Graphics Library', type: 'action', category: 'threejs' },
  { id: 'unreal', x: 50, y: 310, title: 'Unreal Engine', subtitle: 'Game Development', type: 'action', category: 'unreal' },
  { id: 'github', x: 340, y: 310, title: 'GitHub', subtitle: 'Version Control', type: 'action', category: 'devops' },
  { id: 'android', x: 630, y: 310, title: 'Android Studio', subtitle: 'Native Android', type: 'trigger', category: 'android' },
  { id: 'firebase', x: 220, y: 480, title: 'Firebase', subtitle: 'Hosting & BaaS', type: 'output', category: 'firebase' },
  { id: 'aws', x: 460, y: 480, title: 'AWS EC2', subtitle: '+ CI/CD Pipeline', type: 'output', category: 'devops' },
];

// Define connections
const connections = [
  { from: 'react', to: 'github' },
  { from: 'react', to: 'threejs' },
  { from: 'threejs', to: 'github' },
  { from: 'reactnative', to: 'github' },
  { from: 'reactnative', to: 'threejs' },
  { from: 'android', to: 'github' },
  { from: 'django', to: 'github' },
  { from: 'unreal', to: 'github' },
  { from: 'github', to: 'firebase' },
  { from: 'github', to: 'aws' },
];

const NodeCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const canvasRef = useRef(null);

  // Get input nodes (nodes that connect TO this node)
  const getInputNodes = useCallback((nodeId) => {
    return connections
      .filter(conn => conn.to === nodeId)
      .map(conn => nodes.find(n => n.id === conn.from))
      .filter(Boolean);
  }, [nodes]);

  // Get output nodes (nodes that this node connects TO)
  const getOutputNodes = useCallback((nodeId) => {
    return connections
      .filter(conn => conn.from === nodeId)
      .map(conn => nodes.find(n => n.id === conn.to))
      .filter(Boolean);
  }, [nodes]);

  const handleMouseDown = useCallback((e, nodeId) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
    setDraggedNode(nodeId);
  }, [nodes]);

  const handleMouseMove = useCallback((e) => {
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setNodes(prevNodes =>
      prevNodes.map(node => {
        if (node.id !== draggedNode) return node;
        const canvasWidth = canvasRef.current?.clientWidth || 1200;
        const canvasHeight = canvasRef.current?.clientHeight || 600;
        return {
          ...node,
          x: Math.max(20, Math.min(newX, canvasWidth - NODE_WIDTH - 20)),
          y: Math.max(20, Math.min(newY, canvasHeight - NODE_HEIGHT - 20))
        };
      })
    );
  }, [draggedNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  // Double click to open node details
  const handleDoubleClick = useCallback((nodeId) => {
    setSelectedNode(nodeId);
    setActiveTab('input');
  }, []);

  const closeModal = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const getNodeById = useCallback((id) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  // Path calculation
  const getConnectionPath = useCallback((fromId, toId) => {
    const sourceNode = getNodeById(fromId);
    const targetNode = getNodeById(toId);
    if (!sourceNode || !targetNode) return { path: '' };

    const sourceCenter = { x: sourceNode.x + NODE_WIDTH / 2, y: sourceNode.y + NODE_HEIGHT / 2 };
    const targetCenter = { x: targetNode.x + NODE_WIDTH / 2, y: targetNode.y + NODE_HEIGHT / 2 };

    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;

    let sourceX, sourceY, targetX, targetY, sourceDir;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        sourceX = sourceNode.x + NODE_WIDTH;
        sourceY = sourceNode.y + NODE_HEIGHT / 2;
        targetX = targetNode.x;
        targetY = targetNode.y + NODE_HEIGHT / 2;
        sourceDir = 'right';
      } else {
        sourceX = sourceNode.x;
        sourceY = sourceNode.y + NODE_HEIGHT / 2;
        targetX = targetNode.x + NODE_WIDTH;
        targetY = targetNode.y + NODE_HEIGHT / 2;
        sourceDir = 'left';
      }
    } else {
      if (dy > 0) {
        sourceX = sourceNode.x + NODE_WIDTH / 2;
        sourceY = sourceNode.y + NODE_HEIGHT;
        targetX = targetNode.x + NODE_WIDTH / 2;
        targetY = targetNode.y;
        sourceDir = 'bottom';
      } else {
        sourceX = sourceNode.x + NODE_WIDTH / 2;
        sourceY = sourceNode.y;
        targetX = targetNode.x + NODE_WIDTH / 2;
        targetY = targetNode.y + NODE_HEIGHT;
        sourceDir = 'top';
      }
    }

    const newDx = targetX - sourceX;
    const newDy = targetY - sourceY;
    const absDx = Math.abs(newDx);
    const absDy = Math.abs(newDy);
    const borderRadius = 10;
    let path;

    if (absDx < 5 || absDy < 5) {
      path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    } else {
      const r = Math.min(borderRadius, absDy / 3, absDx / 3);
      const dirX = newDx > 0 ? 1 : -1;
      const dirY = newDy > 0 ? 1 : -1;

      if (sourceDir === 'bottom' || sourceDir === 'top') {
        const midY = sourceY + newDy / 2;
        path = [
          `M ${sourceX} ${sourceY}`,
          `L ${sourceX} ${midY - r * dirY}`,
          `A ${r} ${r} 0 0 ${(dirX > 0) !== (dirY > 0) ? 1 : 0} ${sourceX + r * dirX} ${midY}`,
          `L ${targetX - r * dirX} ${midY}`,
          `A ${r} ${r} 0 0 ${(dirX > 0) === (dirY > 0) ? 1 : 0} ${targetX} ${midY + r * dirY}`,
          `L ${targetX} ${targetY}`
        ].join(' ');
      } else {
        const midX = sourceX + newDx / 2;
        path = [
          `M ${sourceX} ${sourceY}`,
          `L ${midX - r * dirX} ${sourceY}`,
          `A ${r} ${r} 0 0 ${(dirX > 0) === (dirY > 0) ? 1 : 0} ${midX} ${sourceY + r * dirY}`,
          `L ${midX} ${targetY - r * dirY}`,
          `A ${r} ${r} 0 0 ${(dirX > 0) !== (dirY > 0) ? 1 : 0} ${midX + r * dirX} ${targetY}`,
          `L ${targetX} ${targetY}`
        ].join(' ');
      }
    }

    return { path };
  }, [getNodeById]);

  const skillIcons = {
    react: SiReact,
    threejs: SiThreedotjs,
    django: SiDjango,
    reactnative: SiExpo,
    unreal: SiUnrealengine,
    firebase: SiFirebase,
    android: SiAndroidstudio,
    github: FaGithub,
    aws: SiAmazonec2,
  };

  const getCategoryColor = (category) => {
    const colors = {
      react: { bg: 'linear-gradient(135deg, #61dafb 0%, #21a1c4 100%)', border: '#61dafb' },
      reactnative: { bg: 'linear-gradient(135deg, #61dbfb 0%, #087ea4 100%)', border: '#61dbfb' },
      threejs: { bg: 'linear-gradient(135deg, #000000 0%, #333333 100%)', border: '#000000' },
      backend: { bg: 'linear-gradient(135deg, #092e20 0%, #0c4b33 100%)', border: '#44a340' },
      android: { bg: 'linear-gradient(135deg, #3ddc84 0%, #2da866 100%)', border: '#3ddc84' },
      devops: { bg: 'linear-gradient(135deg, #ff9900 0%, #232f3e 100%)', border: '#ff9900' },
      firebase: { bg: 'linear-gradient(135deg, #ffca28 0%, #ff9900 100%)', border: '#ffca28' },
      unreal: { bg: 'linear-gradient(135deg, #313131 0%, #0e0e0e 100%)', border: '#313131' },
    };
    return colors[category] || colors.react;
  };

  const selectedNodeData = selectedNode ? getNodeById(selectedNode) : null;
  const selectedNodeDetails = selectedNode ? nodeDetails[selectedNode] : null;

  return (
    <motion.section
      className="node-canvas-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="node-canvas-container">
        <motion.div
          className="node-canvas-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="node-canvas-title">My Skills Flow</h2>
          <p className="node-canvas-subtitle">Double-click any node to see details</p>
        </motion.div>

        <div
          ref={canvasRef}
          className="node-canvas"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="node-canvas-grid" />

          <svg className="node-connections">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
            {connections.map((conn) => {
              const { path } = getConnectionPath(conn.from, conn.to);
              const sourceNode = getNodeById(conn.from);
              const color = getCategoryColor(sourceNode?.category).border;
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <path d={path} stroke="rgba(0, 0, 0, 0.06)" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" className="connection-path" strokeOpacity="0.7" markerEnd="url(#arrowhead)" />
                </g>
              );
            })}
          </svg>

          {nodes.map((node, index) => {
            const categoryStyle = getCategoryColor(node.category);
            return (
              <motion.div
                key={node.id}
                className={`n8n-node ${node.type} ${node.category}`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                  cursor: draggedNode === node.id ? 'grabbing' : 'grab',
                  '--category-border': categoryStyle.border,
                }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onDoubleClick={() => handleDoubleClick(node.id)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
              >
                <div className="n8n-handle n8n-handle-top">
                  <div className="n8n-handle-inner" style={{ background: categoryStyle.border }} />
                </div>
                <div className="n8n-handle n8n-handle-bottom">
                  <div className="n8n-handle-inner" style={{ background: categoryStyle.border }} />
                </div>
                <div className="n8n-handle n8n-handle-left">
                  <div className="n8n-handle-inner" style={{ background: categoryStyle.border }} />
                </div>
                <div className="n8n-handle n8n-handle-right">
                  <div className="n8n-handle-inner" style={{ background: categoryStyle.border }} />
                </div>

                <div className="n8n-node-content">
                  <div className="n8n-node-icon" style={{ background: categoryStyle.bg }}>
                    {skillIcons[node.id] && React.createElement(skillIcons[node.id], { className: 'node-icon-svg' })}
                  </div>
                  <div className="n8n-node-info">
                    <div className="n8n-node-title">{node.title}</div>
                    <div className="n8n-node-subtitle">{node.subtitle}</div>
                  </div>
                </div>

                {node.type === 'trigger' && (
                  <div className="n8n-node-badge">Entry</div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Node Detail Modal */}
        <AnimatePresence>
          {selectedNode && selectedNodeData && selectedNodeDetails && (
            <motion.div
              className="node-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="node-modal"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="node-modal-header" style={{ borderColor: getCategoryColor(selectedNodeData.category).border }}>
                  <div className="node-modal-header-left">
                    <div className="node-modal-icon" style={{ background: getCategoryColor(selectedNodeData.category).bg }}>
                      {skillIcons[selectedNode] && React.createElement(skillIcons[selectedNode], { className: 'node-icon-svg' })}
                    </div>
                    <div>
                      <h3 className="node-modal-title">{selectedNodeData.title}</h3>
                      <p className="node-modal-subtitle">{selectedNodeData.subtitle}</p>
                    </div>
                  </div>
                  <button className="node-modal-close" onClick={closeModal}>
                    <FaTimes />
                  </button>
                </div>

                {/* Tabs */}
                <div className="node-modal-tabs">
                  <button
                    className={`node-modal-tab ${activeTab === 'input' ? 'active' : ''}`}
                    onClick={() => setActiveTab('input')}
                  >
                    Input ({getInputNodes(selectedNode).length})
                  </button>
                  <button
                    className={`node-modal-tab ${activeTab === 'output' ? 'active' : ''}`}
                    onClick={() => setActiveTab('output')}
                  >
                    Output ({getOutputNodes(selectedNode).length})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="node-modal-content">
                  {activeTab === 'input' && (
                    <div className="node-modal-panel">
                      <h4>Input from:</h4>
                      {getInputNodes(selectedNode).length > 0 ? (
                        <div className="node-modal-items">
                          {getInputNodes(selectedNode).map(inputNode => (
                            <div key={inputNode.id} className="node-modal-item">
                              <div className="node-modal-item-icon" style={{ background: getCategoryColor(inputNode.category).bg }}>
                                {skillIcons[inputNode.id] && React.createElement(skillIcons[inputNode.id], { size: 16 })}
                              </div>
                              <div>
                                <div className="node-modal-item-title">{inputNode.title}</div>
                                <div className="node-modal-item-output">{nodeDetails[inputNode.id]?.output}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="node-modal-empty">This is an entry point - no input connections</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'output' && (
                    <div className="node-modal-panel">
                      <h4>Output to:</h4>
                      {getOutputNodes(selectedNode).length > 0 ? (
                        <div className="node-modal-items">
                          {getOutputNodes(selectedNode).map(outputNode => (
                            <div key={outputNode.id} className="node-modal-item">
                              <div className="node-modal-item-icon" style={{ background: getCategoryColor(outputNode.category).bg }}>
                                {skillIcons[outputNode.id] && React.createElement(skillIcons[outputNode.id], { size: 16 })}
                              </div>
                              <div>
                                <div className="node-modal-item-title">{outputNode.title}</div>
                                <div className="node-modal-item-subtitle">{outputNode.subtitle}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="node-modal-empty">This is a final output - no further connections</p>
                      )}
                    </div>
                  )}

                  {/* Description Section */}
                  <div className="node-modal-description">
                    <h4>Description</h4>
                    <p>{selectedNodeDetails.description}</p>

                    <h4>Skills</h4>
                    <div className="node-modal-skills">
                      {selectedNodeDetails.skills.map((skill, i) => (
                        <span key={i} className="node-modal-skill-tag">{skill}</span>
                      ))}
                    </div>

                    <h4>Output</h4>
                    <p className="node-modal-output-text">{selectedNodeDetails.output}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default NodeCanvas;
