import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './NodeCanvas.css';

// Node dimensions matching n8n style
const NODE_WIDTH = 160;
const NODE_HEIGHT = 70;
const HANDLE_SIZE = 10;

// Skills flow structure
const initialNodes = [
  // Frontend Workshop (Entry Point)
  { id: 'react', x: 420, y: 30, title: 'React', subtitle: 'Frontend Framework', type: 'trigger', category: 'frontend' },

  // Three branches from React
  { id: 'threejs', x: 120, y: 140, title: 'Three.js', subtitle: '3D Graphics', type: 'action', category: 'frontend' },
  { id: 'django', x: 420, y: 140, title: 'Django', subtitle: 'Backend Framework', type: 'action', category: 'backend' },
  { id: 'reactnative', x: 720, y: 140, title: 'React Native', subtitle: '+ Expo', type: 'action', category: 'mobile' },

  // Second level
  { id: 'unreal', x: 120, y: 250, title: 'Unreal Engine', subtitle: 'Game Dev', type: 'action', category: 'frontend' },
  { id: 'firebase', x: 420, y: 250, title: 'Firebase', subtitle: 'BaaS Platform', type: 'action', category: 'backend' },
  { id: 'android', x: 720, y: 250, title: 'Android Studio', subtitle: 'Native Android', type: 'action', category: 'mobile' },

  // Deployment Hub
  { id: 'github', x: 420, y: 360, title: 'GitHub', subtitle: 'Version Control', type: 'action', category: 'devops' },
  { id: 'aws', x: 420, y: 470, title: 'AWS EC2', subtitle: '+ CI/CD Pipeline', type: 'output', category: 'devops' },
];

// Define connections between nodes
const connections = [
  // From React to three branches
  { from: 'react', to: 'threejs' },
  { from: 'react', to: 'django' },
  { from: 'react', to: 'reactnative' },

  // Second level connections
  { from: 'threejs', to: 'unreal' },
  { from: 'django', to: 'firebase' },
  { from: 'reactnative', to: 'android' },

  // All converge to GitHub
  { from: 'unreal', to: 'github' },
  { from: 'firebase', to: 'github' },
  { from: 'android', to: 'github' },

  // GitHub to AWS
  { from: 'github', to: 'aws' },
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

  // SmoothStep path calculation for vertical and horizontal flows
  const getConnectionPath = useCallback((fromId, toId) => {
    const sourceNode = getNodeById(fromId);
    const targetNode = getNodeById(toId);
    if (!sourceNode || !targetNode) return '';

    // Determine connection direction based on positions
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

    // Determine handle positions based on relative node positions
    if (Math.abs(dy) > Math.abs(dx)) {
      // Vertical connection (top/bottom handles)
      if (dy > 0) {
        // Target is below source
        sourceX = sourceNode.x + NODE_WIDTH / 2;
        sourceY = sourceNode.y + NODE_HEIGHT;
        targetX = targetNode.x + NODE_WIDTH / 2;
        targetY = targetNode.y;
      } else {
        // Target is above source
        sourceX = sourceNode.x + NODE_WIDTH / 2;
        sourceY = sourceNode.y;
        targetX = targetNode.x + NODE_WIDTH / 2;
        targetY = targetNode.y + NODE_HEIGHT;
      }
    } else {
      // Horizontal connection (left/right handles)
      if (dx > 0) {
        // Target is to the right
        sourceX = sourceNode.x + NODE_WIDTH;
        sourceY = sourceNode.y + NODE_HEIGHT / 2;
        targetX = targetNode.x;
        targetY = targetNode.y + NODE_HEIGHT / 2;
      } else {
        // Target is to the left
        sourceX = sourceNode.x;
        sourceY = sourceNode.y + NODE_HEIGHT / 2;
        targetX = targetNode.x + NODE_WIDTH;
        targetY = targetNode.y + NODE_HEIGHT / 2;
      }
    }

    const newDx = targetX - sourceX;
    const newDy = targetY - sourceY;
    const absDx = Math.abs(newDx);
    const absDy = Math.abs(newDy);

    const borderRadius = 8;

    // Straight line for aligned nodes
    if (absDx < 5 && absDy > 0) {
      return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    }
    if (absDy < 5 && absDx > 0) {
      return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    }

    // SmoothStep path with 90-degree turns
    const r = Math.min(borderRadius, absDy / 3, absDx / 3);

    if (absDy > absDx) {
      // Primarily vertical - step horizontally in the middle
      const midY = sourceY + newDy / 2;
      const dirX = newDx > 0 ? 1 : -1;
      const dirY = newDy > 0 ? 1 : -1;

      return [
        `M ${sourceX} ${sourceY}`,
        `L ${sourceX} ${midY - r * dirY}`,
        `A ${r} ${r} 0 0 ${(dirX > 0) !== (dirY > 0) ? 1 : 0} ${sourceX + r * dirX} ${midY}`,
        `L ${targetX - r * dirX} ${midY}`,
        `A ${r} ${r} 0 0 ${(dirX > 0) === (dirY > 0) ? 1 : 0} ${targetX} ${midY + r * dirY}`,
        `L ${targetX} ${targetY}`
      ].join(' ');
    } else {
      // Primarily horizontal - step vertically in the middle
      const midX = sourceX + newDx / 2;
      const dirX = newDx > 0 ? 1 : -1;
      const dirY = newDy > 0 ? 1 : -1;

      return [
        `M ${sourceX} ${sourceY}`,
        `L ${midX - r * dirX} ${sourceY}`,
        `A ${r} ${r} 0 0 ${(dirX > 0) === (dirY > 0) ? 1 : 0} ${midX} ${sourceY + r * dirY}`,
        `L ${midX} ${targetY - r * dirY}`,
        `A ${r} ${r} 0 0 ${(dirX > 0) !== (dirY > 0) ? 1 : 0} ${midX + r * dirX} ${targetY}`,
        `L ${targetX} ${targetY}`
      ].join(' ');
    }
  }, [getNodeById]);

  // Get icon for each skill
  const getSkillIcon = (id) => {
    const icons = {
      react: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <circle cx="12" cy="12" r="2.5"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)"/>
        </svg>
      ),
      threejs: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <path d="M3 3l18 4.5L12 21 3 3zm2.5 2.5l11.5 3-7 10.5-4.5-13.5z"/>
        </svg>
      ),
      django: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <path d="M7 2v20l3-1.5V14h2c3.5 0 5-2.5 5-5.5S15.5 3 12 3H7zm3 3h2c1.5 0 2 1 2 2.5S13.5 10 12 10h-2V5z"/>
        </svg>
      ),
      reactnative: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <rect x="5" y="2" width="14" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="3"/>
          <circle cx="12" cy="19" r="1"/>
        </svg>
      ),
      unreal: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      firebase: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <path d="M4.5 21L7 4l5 9.5L17 8l2.5 13H4.5z"/>
        </svg>
      ),
      android: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
        </svg>
      ),
      github: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      ),
      aws: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
          <path d="M6.5 17.5l-4-2V8l4 2v7.5zM7 7.5L3 5.5l4-2 4 2-4 2zm10.5 10l-4-2V8l4 2v7.5zm.5-10l-4-2 4-2 4 2-4 2zm-6 12.5l-4-2v-7.5l4 2v7.5zm.5-8l-4-2 4-2 4 2-4 2z"/>
        </svg>
      ),
    };
    return icons[id] || (
      <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
        <circle cx="12" cy="12" r="8"/>
      </svg>
    );
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      frontend: { bg: 'linear-gradient(135deg, #61dafb 0%, #21a1c4 100%)', border: '#61dafb' },
      backend: { bg: 'linear-gradient(135deg, #092e20 0%, #0c4b33 100%)', border: '#0c4b33' },
      mobile: { bg: 'linear-gradient(135deg, #61dafb 0%, #3ddc84 100%)', border: '#3ddc84' },
      devops: { bg: 'linear-gradient(135deg, #f90 0%, #232f3e 100%)', border: '#f90' },
    };
    return colors[category] || colors.frontend;
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
          <p className="node-canvas-subtitle">How I learned and connected each technology in my journey</p>
        </motion.div>

        {/* Legend */}
        <div className="skill-legend">
          <div className="legend-item">
            <span className="legend-dot frontend"></span>
            <span>Frontend</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot backend"></span>
            <span>Backend</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot mobile"></span>
            <span>Mobile</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot devops"></span>
            <span>DevOps</span>
          </div>
        </div>

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
            {connections.map((conn) => {
              const pathData = getConnectionPath(conn.from, conn.to);
              const sourceNode = getNodeById(conn.from);
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  {/* Connection line shadow */}
                  <path
                    d={pathData}
                    stroke="rgba(0, 0, 0, 0.08)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Main connection line */}
                  <path
                    d={pathData}
                    stroke={getCategoryColor(sourceNode?.category).border}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="connection-path"
                    strokeOpacity="0.6"
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
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
                drag={false}
              >
                {/* Input Handle */}
                {node.type !== 'trigger' && (
                  <div className="n8n-handle n8n-handle-input n8n-handle-top">
                    <div className="n8n-handle-inner" style={{ background: categoryStyle.border }} />
                  </div>
                )}

                {/* Node Content */}
                <div className="n8n-node-content">
                  <div
                    className="n8n-node-icon"
                    style={{ background: categoryStyle.bg }}
                  >
                    {getSkillIcon(node.id)}
                  </div>
                  <div className="n8n-node-info">
                    <div className="n8n-node-title">{node.title}</div>
                    <div className="n8n-node-subtitle">{node.subtitle}</div>
                  </div>
                </div>

                {/* Output Handle */}
                {node.type !== 'output' && (
                  <div className="n8n-handle n8n-handle-output n8n-handle-bottom">
                    <div className="n8n-handle-inner" style={{ background: categoryStyle.border }} />
                  </div>
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
