import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import { FaGithub } from 'react-icons/fa';
import './NodeCanvas.css';

// Node dimensions
const NODE_WIDTH = 150;
const NODE_HEIGHT = 65;

// Skills flow structure - Updated based on actual learning/usage path
const initialNodes = [
  // Top row - Entry points
  { id: 'react', x: 50, y: 30, title: 'React', subtitle: 'Frontend Framework', type: 'trigger', category: 'react' },
  { id: 'django', x: 340, y: 30, title: 'Django', subtitle: 'Backend Framework', type: 'trigger', category: 'backend' },
  { id: 'reactnative', x: 630, y: 30, title: 'React Native', subtitle: '+ Expo', type: 'trigger', category: 'reactnative' },

  // Second row
  { id: 'threejs', x: 260, y: 170, title: 'Three.js', subtitle: '3D Graphics Library', type: 'action', category: 'threejs' },

  // Third row - middle
  { id: 'unreal', x: 50, y: 310, title: 'Unreal Engine', subtitle: 'Game Development', type: 'action', category: 'unreal' },
  { id: 'github', x: 340, y: 310, title: 'GitHub', subtitle: 'Version Control', type: 'action', category: 'devops' },
  { id: 'android', x: 630, y: 310, title: 'Android Studio', subtitle: 'Native Android', type: 'trigger', category: 'android' },

  // Bottom row - Deployment targets
  { id: 'firebase', x: 220, y: 480, title: 'Firebase', subtitle: 'Hosting & BaaS', type: 'output', category: 'firebase' },
  { id: 'aws', x: 460, y: 480, title: 'AWS EC2', subtitle: '+ CI/CD Pipeline', type: 'output', category: 'devops' },
];

// Define connections - Updated flow
const connections = [
  // React has 2 paths: direct to GitHub + through Three.js
  { from: 'react', to: 'github', label: 'direct' },
  { from: 'react', to: 'threejs', label: 'uses 3D' },
  { from: 'threejs', to: 'github', label: 'via' },

  // React Native has 2 paths: direct to GitHub + through Three.js
  { from: 'reactnative', to: 'github', label: 'direct' },
  { from: 'reactnative', to: 'threejs', label: 'uses 3D' },

  // Other paths connect to GitHub directly
  { from: 'android', to: 'github', label: 'via' },
  { from: 'django', to: 'github', label: 'via' },
  { from: 'unreal', to: 'github', label: 'server via' },

  // GitHub to Firebase and AWS (both are deployment targets)
  { from: 'github', to: 'firebase', label: 'deploys to' },
  { from: 'github', to: 'aws', label: 'deploys to' },
];

const NodeCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

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

  // Get node by ID
  const getNodeById = useCallback((id) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  // Smart path calculation - determines best connection points
  const getConnectionPath = useCallback((fromId, toId) => {
    const sourceNode = getNodeById(fromId);
    const targetNode = getNodeById(toId);
    if (!sourceNode || !targetNode) return { path: '', labelPos: { x: 0, y: 0 } };

    const sourceCenter = {
      x: sourceNode.x + NODE_WIDTH / 2,
      y: sourceNode.y + NODE_HEIGHT / 2
    };
    const targetCenter = {
      x: targetNode.x + NODE_WIDTH / 2,
      y: targetNode.y + NODE_HEIGHT / 2
    };

    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;

    let sourceX, sourceY, targetX, targetY;
    let sourceDir, targetDir;

    // Determine optimal connection points based on relative positions
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      if (dx > 0) {
        sourceX = sourceNode.x + NODE_WIDTH;
        sourceY = sourceNode.y + NODE_HEIGHT / 2;
        targetX = targetNode.x;
        targetY = targetNode.y + NODE_HEIGHT / 2;
        sourceDir = 'right';
        targetDir = 'left';
      } else {
        sourceX = sourceNode.x;
        sourceY = sourceNode.y + NODE_HEIGHT / 2;
        targetX = targetNode.x + NODE_WIDTH;
        targetY = targetNode.y + NODE_HEIGHT / 2;
        sourceDir = 'left';
        targetDir = 'right';
      }
    } else {
      // Vertical connection
      if (dy > 0) {
        sourceX = sourceNode.x + NODE_WIDTH / 2;
        sourceY = sourceNode.y + NODE_HEIGHT;
        targetX = targetNode.x + NODE_WIDTH / 2;
        targetY = targetNode.y;
        sourceDir = 'bottom';
        targetDir = 'top';
      } else {
        sourceX = sourceNode.x + NODE_WIDTH / 2;
        sourceY = sourceNode.y;
        targetX = targetNode.x + NODE_WIDTH / 2;
        targetY = targetNode.y + NODE_HEIGHT;
        sourceDir = 'top';
        targetDir = 'bottom';
      }
    }

    const newDx = targetX - sourceX;
    const newDy = targetY - sourceY;
    const absDx = Math.abs(newDx);
    const absDy = Math.abs(newDy);

    const borderRadius = 10;
    let path;

    // Straight line for aligned nodes
    if (absDx < 5 || absDy < 5) {
      path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    } else {
      // SmoothStep path with rounded corners
      const r = Math.min(borderRadius, absDy / 3, absDx / 3);
      const dirX = newDx > 0 ? 1 : -1;
      const dirY = newDy > 0 ? 1 : -1;

      if (sourceDir === 'bottom' || sourceDir === 'top') {
        // Vertical first, then horizontal
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
        // Horizontal first, then vertical
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

    // Calculate label position (midpoint)
    const labelPos = {
      x: (sourceX + targetX) / 2,
      y: (sourceY + targetY) / 2
    };

    return { path, labelPos };
  }, [getNodeById]);

  // Get icon component for each skill
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

  // Get category color
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
          <p className="node-canvas-subtitle">How my technologies connect and deploy together</p>
        </motion.div>

        <div
          ref={canvasRef}
          className="node-canvas"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Dot Grid Background */}
          <div className="node-canvas-grid" />

          {/* Connection Lines */}
          <svg className="node-connections">
            <defs>
              {/* Arrow marker */}
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
            {connections.map((conn) => {
              const { path, labelPos } = getConnectionPath(conn.from, conn.to);
              const sourceNode = getNodeById(conn.from);
              const color = getCategoryColor(sourceNode?.category).border;
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  {/* Connection line shadow */}
                  <path
                    d={path}
                    stroke="rgba(0, 0, 0, 0.06)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Main connection line */}
                  <path
                    d={path}
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="connection-path"
                    strokeOpacity="0.7"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
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
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
                drag={false}
              >
                {/* Handles */}
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

                {/* Node Content */}
                <div className="n8n-node-content">
                  <div
                    className="n8n-node-icon"
                    style={{ background: categoryStyle.bg }}
                  >
                    {skillIcons[node.id] && React.createElement(skillIcons[node.id], { className: 'node-icon-svg' })}
                  </div>
                  <div className="n8n-node-info">
                    <div className="n8n-node-title">{node.title}</div>
                    <div className="n8n-node-subtitle">{node.subtitle}</div>
                  </div>
                </div>

                {/* Entry point badge for triggers */}
                {node.type === 'trigger' && (
                  <div className="n8n-node-badge">Entry</div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.section>
  );
};

export default NodeCanvas;
