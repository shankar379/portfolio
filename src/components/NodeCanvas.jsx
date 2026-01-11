import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './NodeCanvas.css';

// Node dimensions matching n8n style
const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const HANDLE_SIZE = 12;

const NodeCanvas = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 80, y: 200, title: 'When clicking', subtitle: 'Test workflow', type: 'trigger', icon: 'play' },
    { id: 2, x: 320, y: 120, title: 'HTTP Request', subtitle: 'GET /api/data', type: 'action', icon: 'http' },
    { id: 3, x: 560, y: 220, title: 'Code', subtitle: 'Transform data', type: 'action', icon: 'code' },
    { id: 4, x: 800, y: 140, title: 'Respond', subtitle: 'Send response', type: 'output', icon: 'send' },
  ]);
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
        const canvasHeight = canvasRef.current?.clientHeight || 500;
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

  // SmoothStep path calculation (like n8n uses via Vue Flow)
  // Creates paths with 90-degree turns and rounded corners
  const getSmoothStepPath = useCallback((sourceNode, targetNode) => {
    // Connection points: output handle (right) to input handle (left)
    const sourceX = sourceNode.x + NODE_WIDTH + HANDLE_SIZE / 2;
    const sourceY = sourceNode.y + NODE_HEIGHT / 2;
    const targetX = targetNode.x - HANDLE_SIZE / 2;
    const targetY = targetNode.y + NODE_HEIGHT / 2;

    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const absDy = Math.abs(dy);

    // Configuration matching n8n/Vue Flow defaults
    const borderRadius = 8; // Rounded corners
    const offset = 20; // Spacing from handles before first bend

    // If nodes are roughly aligned horizontally, use simple curve
    if (absDy < 5) {
      // Simple horizontal bezier for aligned nodes
      const controlOffset = Math.min(Math.abs(dx) * 0.4, 80);
      return `M ${sourceX} ${sourceY} C ${sourceX + controlOffset} ${sourceY}, ${targetX - controlOffset} ${targetY}, ${targetX} ${targetY}`;
    }

    // SmoothStep path with 90-degree turns
    // Path: source → horizontal → turn → vertical → turn → horizontal → target
    const midX = sourceX + dx / 2; // Midpoint for the vertical segment
    const r = Math.min(borderRadius, absDy / 2, Math.abs(dx) / 4);
    const direction = dy > 0 ? 1 : -1; // 1 = down, -1 = up

    // Build path with rounded corners using arc commands
    // M = move to, L = line to, A = arc (rx ry rotation large-arc sweep-flag x y)
    const path = [
      `M ${sourceX} ${sourceY}`,
      // Horizontal line from source to first bend
      `L ${midX - r} ${sourceY}`,
      // First rounded corner (turn vertical)
      `A ${r} ${r} 0 0 ${dy > 0 ? 1 : 0} ${midX} ${sourceY + r * direction}`,
      // Vertical line
      `L ${midX} ${targetY - r * direction}`,
      // Second rounded corner (turn horizontal)
      `A ${r} ${r} 0 0 ${dy > 0 ? 0 : 1} ${midX + r} ${targetY}`,
      // Horizontal line to target
      `L ${targetX} ${targetY}`
    ].join(' ');

    return path;
  }, []);

  // Get node icon based on type
  const getNodeIcon = (icon) => {
    switch (icon) {
      case 'play':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
            <path d="M8 5v14l11-7z"/>
          </svg>
        );
      case 'http':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      case 'code':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
        );
      case 'send':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="node-icon-svg">
            <circle cx="12" cy="12" r="8"/>
          </svg>
        );
    }
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
          <h2 className="node-canvas-title">Workflow Canvas</h2>
          <p className="node-canvas-subtitle">Drag and manage nodes to create your workflow</p>
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

          {/* Connection Lines - n8n style SmoothStep paths */}
          <svg className="node-connections">
            {nodes.slice(0, -1).map((node, index) => {
              const nextNode = nodes[index + 1];
              if (!nextNode) return null;
              const pathData = getSmoothStepPath(node, nextNode);
              return (
                <g key={`connection-${node.id}-${nextNode.id}`}>
                  {/* Connection line shadow */}
                  <path
                    d={pathData}
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Main connection line */}
                  <path
                    d={pathData}
                    stroke="#b1b1b7"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="connection-path"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes - n8n style */}
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              className={`n8n-node ${node.type}`}
              style={{
                left: node.x,
                top: node.y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                cursor: draggedNode === node.id ? 'grabbing' : 'grab',
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              drag={false}
            >
              {/* Input Handle - Left side (rectangle style) */}
              {node.type !== 'trigger' && (
                <div className="n8n-handle n8n-handle-input">
                  <div className="n8n-handle-inner" />
                </div>
              )}

              {/* Node Content */}
              <div className="n8n-node-content">
                <div className={`n8n-node-icon ${node.type}`}>
                  {getNodeIcon(node.icon)}
                </div>
                <div className="n8n-node-info">
                  <div className="n8n-node-title">{node.title}</div>
                  <div className="n8n-node-subtitle">{node.subtitle}</div>
                </div>
              </div>

              {/* Output Handle - Right side (circle style) */}
              {node.type !== 'output' && (
                <div className="n8n-handle n8n-handle-output">
                  <div className="n8n-handle-inner" />
                </div>
              )}

              {/* Success indicator */}
              <div className="n8n-node-status">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default NodeCanvas;

