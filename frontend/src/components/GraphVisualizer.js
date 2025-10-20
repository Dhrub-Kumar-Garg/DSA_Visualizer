import React, { useState, useRef, useEffect } from 'react';

const GraphVisualizer = () => {
  // State management
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeValue, setNodeValue] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [queue, setQueue] = useState([]);
  const [stack, setStack] = useState([]);
  const [currentStep, setCurrentStep] = useState('');
  const [executionHistory, setExecutionHistory] = useState([]);
  const [graphType, setGraphType] = useState('directed');
  const [distances, setDistances] = useState({});
  const [mstEdges, setMstEdges] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const canvasRef = useRef(null);
  const [draggedNode, setDraggedNode] = useState(null);

  // Fixed Node Management
  const addNode = () => {
    if (!nodeValue.trim()) {
      alert('Please enter a node value');
      return;
    }

    // Check if node already exists
    if (nodes.find(node => node.value === nodeValue)) {
      alert(`Node "${nodeValue}" already exists!`);
      return;
    }

    const newNode = {
      id: Date.now().toString(),
      value: nodeValue,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 50,
    };
    
    setNodes(prev => [...prev, newNode]);
    setNodeValue('');
    console.log('Added node:', newNode);
  };

  // Fixed Edge Management
  const addEdge = () => {
    if (!edgeSource.trim() || !edgeTarget.trim()) {
      alert('Please enter both source and target node values');
      return;
    }

    const sourceNode = nodes.find(node => node.value === edgeSource);
    const targetNode = nodes.find(node => node.value === edgeTarget);

    if (!sourceNode || !targetNode) {
      alert('One or both nodes do not exist! Create nodes first.');
      return;
    }

    if (sourceNode.value === targetNode.value) {
      alert('Cannot create self-loop!');
      return;
    }

    // Check if edge already exists
    const edgeExists = edges.find(edge => 
      edge.source === sourceNode.value && edge.target === targetNode.value
    );

    if (edgeExists) {
      alert('Edge already exists between these nodes!');
      return;
    }

    const newEdge = {
      id: `edge-${Date.now()}`,
      source: sourceNode.value,
      target: targetNode.value,
      weight: parseInt(edgeWeight) || 1,
    };

    const updatedEdges = [...edges, newEdge];
    
    // If undirected graph, add reverse edge
    if (graphType === 'undirected') {
      const reverseEdge = {
        id: `edge-reverse-${Date.now()}`,
        source: targetNode.value,
        target: sourceNode.value,
        weight: parseInt(edgeWeight) || 1,
      };
      updatedEdges.push(reverseEdge);
    }
    
    setEdges(updatedEdges);
    setEdgeSource('');
    setEdgeTarget('');
    setEdgeWeight(1);
    console.log('Added edge:', newEdge);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setTraversalResult([]);
    setVisitedNodes(new Set());
    setQueue([]);
    setStack([]);
    setCurrentStep('');
    setExecutionHistory([]);
    setDistances({});
    setMstEdges([]);
    setSelectedAlgorithm('');
    setCurrentAlgorithm('');
    setIsAnimating(false);
  };

  // Fixed Graph Representation
  const buildAdjacencyList = () => {
    const adjList = {};
    
    // Initialize all nodes
    nodes.forEach(node => {
      adjList[node.value] = [];
    });

    // Add edges
    edges.forEach(edge => {
      if (adjList[edge.source]) {
        adjList[edge.source].push({
          node: edge.target,
          weight: edge.weight
        });
      }
    });

    console.log('Adjacency List:', adjList);
    return adjList;
  };

  const buildEdgeList = () => {
    return edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight
    }));
  };

  // Fixed BFS Algorithm
  const animateBFS = () => {
    if (nodes.length === 0) {
      alert('Graph is empty! Add nodes first.');
      return;
    }

    resetAnimationState();
    setSelectedAlgorithm('bfs');
    setCurrentAlgorithm('bfs');

    const adjList = buildAdjacencyList();
    const startNode = nodes[0].value;
    
    const visited = new Set([startNode]);
    const result = [];
    const queue = [startNode];
    const steps = [];

    steps.push({
      type: 'start',
      message: `🚀 Starting BFS from node ${startNode}`,
      queue: [...queue],
      visited: new Set(visited)
    });

    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current);

      steps.push({
        type: 'process',
        node: current,
        message: `🎯 Processing node ${current}`,
        queue: [...queue],
        visited: new Set(visited),
        result: [...result]
      });

      // Process neighbors
      const neighbors = adjList[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          queue.push(neighbor.node);
          steps.push({
            type: 'enqueue',
            node: neighbor.node,
            message: `🔍 Found neighbor ${neighbor.node} - added to queue`,
            queue: [...queue],
            visited: new Set(visited)
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      message: `🎉 BFS Complete! Visited ${result.length} nodes: ${result.join(' → ')}`,
      result: [...result]
    });

    animateSteps(steps);
  };

  // Fixed DFS Algorithm
  const animateDFS = () => {
    if (nodes.length === 0) {
      alert('Graph is empty! Add nodes first.');
      return;
    }

    resetAnimationState();
    setSelectedAlgorithm('dfs');
    setCurrentAlgorithm('dfs');

    const adjList = buildAdjacencyList();
    const startNode = nodes[0].value;
    
    const visited = new Set();
    const result = [];
    const stack = [startNode];
    const steps = [];

    steps.push({
      type: 'start',
      message: `🚀 Starting DFS from node ${startNode}`,
      stack: [...stack],
      visited: new Set(visited)
    });

    while (stack.length > 0) {
      const current = stack.pop();

      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);

        steps.push({
          type: 'process',
          node: current,
          message: `🎯 Processing node ${current}`,
          stack: [...stack],
          visited: new Set(visited),
          result: [...result]
        });

        // Add unvisited neighbors to stack in reverse order
        const neighbors = adjList[current] || [];
        const unvisitedNeighbors = neighbors.filter(n => !visited.has(n.node));
        
        for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
          const neighbor = unvisitedNeighbors[i];
          stack.push(neighbor.node);
          steps.push({
            type: 'push',
            node: neighbor.node,
            message: `📥 Pushed neighbor ${neighbor.node} to stack`,
            stack: [...stack],
            visited: new Set(visited)
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      message: `🎉 DFS Complete! Visited ${result.length} nodes: ${result.join(' → ')}`,
      result: [...result]
    });

    animateSteps(steps);
  };

  // Fixed Dijkstra's Algorithm
  const animateDijkstra = () => {
    if (nodes.length === 0) {
      alert('Graph is empty! Add nodes first.');
      return;
    }

    resetAnimationState();
    setSelectedAlgorithm('dijkstra');
    setCurrentAlgorithm('dijkstra');

    const adjList = buildAdjacencyList();
    const startNode = nodes[0].value;
    
    const dist = {};
    const visited = new Set();
    const steps = [];

    // Initialize distances
    nodes.forEach(node => {
      dist[node.value] = node.value === startNode ? 0 : Infinity;
    });

    steps.push({
      type: 'init',
      message: `🚀 Starting Dijkstra from node ${startNode}`,
      distances: {...dist},
      visited: new Set(visited)
    });

    while (visited.size < nodes.length) {
      // Find unvisited node with minimum distance
      let minNode = null;
      let minDist = Infinity;

      nodes.forEach(node => {
        if (!visited.has(node.value) && dist[node.value] < minDist) {
          minDist = dist[node.value];
          minNode = node.value;
        }
      });

      if (minNode === null) break;

      visited.add(minNode);
      steps.push({
        type: 'visit',
        node: minNode,
        message: `📍 Visiting node ${minNode} (distance: ${dist[minNode]})`,
        distances: {...dist},
        visited: new Set(visited)
      });

      // Update neighbors
      const neighbors = adjList[minNode] || [];
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor.node)) {
          const newDist = dist[minNode] + neighbor.weight;
          if (newDist < dist[neighbor.node]) {
            dist[neighbor.node] = newDist;
            steps.push({
              type: 'update',
              node: neighbor.node,
              message: `📈 Updated ${neighbor.node} distance to ${newDist}`,
              distances: {...dist},
              visited: new Set(visited)
            });
          }
        }
      });
    }

    steps.push({
      type: 'complete',
      message: `🎉 Dijkstra Complete! All shortest paths calculated from ${startNode}`,
      distances: {...dist}
    });

    setDistances(dist);
    animateSteps(steps);
  };

  // Fixed Prim's Algorithm
  const animatePrim = () => {
    if (nodes.length === 0) {
      alert('Graph is empty! Add nodes first.');
      return;
    }

    resetAnimationState();
    setSelectedAlgorithm('prim');
    setCurrentAlgorithm('prim');

    const adjList = buildAdjacencyList();
    const startNode = nodes[0].value;
    
    const visited = new Set([startNode]);
    const mst = [];
    const steps = [];

    steps.push({
      type: 'start',
      message: `🚀 Starting Prim's Algorithm from node ${startNode}`,
      visited: new Set(visited),
      mstEdges: [...mst]
    });

    while (visited.size < nodes.length) {
      let minEdge = null;
      let minWeight = Infinity;

      // Find minimum edge connecting visited to unvisited
      visited.forEach(node => {
        const neighbors = adjList[node] || [];
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor.node) && neighbor.weight < minWeight) {
            minWeight = neighbor.weight;
            minEdge = { from: node, to: neighbor.node, weight: neighbor.weight };
          }
        });
      });

      if (!minEdge) break;

      visited.add(minEdge.to);
      mst.push(minEdge);

      steps.push({
        type: 'add_edge',
        edge: minEdge,
        message: `🔗 Added edge ${minEdge.from}-${minEdge.to} (weight: ${minEdge.weight}) to MST`,
        visited: new Set(visited),
        mstEdges: [...mst]
      });
    }

    const totalWeight = mst.reduce((sum, edge) => sum + edge.weight, 0);
    steps.push({
      type: 'complete',
      message: `🎉 Prim's Complete! MST has ${mst.length} edges, total weight: ${totalWeight}`,
      mstEdges: [...mst]
    });

    setMstEdges(mst);
    animateSteps(steps);
  };

  // Fixed Kruskal's Algorithm
  const animateKruskal = () => {
    if (nodes.length === 0) {
      alert('Graph is empty! Add nodes first.');
      return;
    }

    resetAnimationState();
    setSelectedAlgorithm('kruskal');
    setCurrentAlgorithm('kruskal');

    const edgesList = buildEdgeList();
    const sortedEdges = [...edgesList].sort((a, b) => a.weight - b.weight);
    
    const parent = {};
    const mst = [];
    const steps = [];

    // Initialize union-find
    nodes.forEach(node => {
      parent[node.value] = node.value;
    });

    steps.push({
      type: 'start',
      message: `🚀 Starting Kruskal's Algorithm - ${sortedEdges.length} edges sorted`,
      mstEdges: [...mst]
    });

    const find = (node) => {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    };

    const union = (x, y) => {
      parent[find(x)] = find(y);
    };

    for (const edge of sortedEdges) {
      if (find(edge.source) !== find(edge.target)) {
        mst.push(edge);
        union(edge.source, edge.target);

        steps.push({
          type: 'add_edge',
          edge: edge,
          message: `✅ Added ${edge.source}-${edge.target} (weight: ${edge.weight}) - No cycle`,
          mstEdges: [...mst]
        });

        if (mst.length === nodes.length - 1) break;
      } else {
        steps.push({
          type: 'skip',
          edge: edge,
          message: `🚫 Skipped ${edge.source}-${edge.target} - Would create cycle`
        });
      }
    }

    const totalWeight = mst.reduce((sum, edge) => sum + edge.weight, 0);
    steps.push({
      type: 'complete',
      message: `🎉 Kruskal's Complete! MST has ${mst.length} edges, total weight: ${totalWeight}`,
      mstEdges: [...mst]
    });

    setMstEdges(mst);
    animateSteps(steps);
  };

  // Helper Functions
  const resetAnimationState = () => {
    setIsAnimating(true);
    setTraversalResult([]);
    setVisitedNodes(new Set());
    setQueue([]);
    setStack([]);
    setCurrentStep('');
    setExecutionHistory([]);
    setDistances({});
    setMstEdges([]);
  };

  const animateSteps = (steps) => {
    let stepIndex = 0;

    const executeStep = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        
        setCurrentStep(step.message);
        setExecutionHistory(prev => [step, ...prev.slice(0, 8)]); // Keep last 9 steps

        // Update state based on step type
        if (step.queue !== undefined) setQueue(step.queue);
        if (step.stack !== undefined) setStack(step.stack);
        if (step.visited !== undefined) setVisitedNodes(step.visited);
        if (step.result !== undefined) setTraversalResult(step.result);
        if (step.distances !== undefined) setDistances(step.distances);
        if (step.mstEdges !== undefined) setMstEdges(step.mstEdges);

        stepIndex++;
        setTimeout(executeStep, animationSpeed);
      } else {
        setIsAnimating(false);
        setTimeout(() => setCurrentStep(''), 2000);
      }
    };

    executeStep();
  };

  // Fixed Drawing Function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges first
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.value === edge.source);
      const targetNode = nodes.find(n => n.value === edge.target);
      
      if (!sourceNode || !targetNode) return;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);

      // Edge styling
      let strokeColor = '#4B5563';
      let lineWidth = 2;

      const isMSTEdge = mstEdges.some(e => 
        (e.source === edge.source && e.target === edge.target) ||
        (e.source === edge.target && e.target === edge.source)
      );

      if (isMSTEdge) {
        strokeColor = '#10B981';
        lineWidth = 4;
      } else if (visitedNodes.has(edge.source) && visitedNodes.has(edge.target)) {
        strokeColor = currentAlgorithm === 'bfs' ? '#3B82F6' : '#8B5CF6';
        lineWidth = 3;
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Draw arrow for directed graphs
      if (graphType === 'directed') {
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
        const arrowSize = 10;
        
        ctx.save();
        ctx.translate(targetNode.x, targetNode.y);
        ctx.rotate(angle - Math.PI / 2);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize / 2, -arrowSize);
        ctx.lineTo(arrowSize / 2, -arrowSize);
        ctx.closePath();
        ctx.fillStyle = strokeColor;
        ctx.fill();
        
        ctx.restore();
      }

      // Draw weight
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      
      ctx.fillStyle = '#F3F4F6';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(edge.weight.toString(), midX + 5, midY - 5);
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);

      // Node color based on state
      let fillColor = '#3B82F6'; // Default blue
      
      if (visitedNodes.has(node.value)) {
        if (selectedAlgorithm === 'bfs') fillColor = '#3B82F6';
        else if (selectedAlgorithm === 'dfs') fillColor = '#8B5CF6';
        else if (selectedAlgorithm === 'dijkstra') fillColor = '#F59E0B';
        else if (selectedAlgorithm === 'prim' || selectedAlgorithm === 'kruskal') fillColor = '#10B981';
      } else if (queue.includes(node.value) || stack.includes(node.value)) {
        fillColor = '#F59E0B'; // Amber for in queue/stack
      }

      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value, node.x, node.y);

      // Distance for Dijkstra
      if (selectedAlgorithm === 'dijkstra' && distances[node.value] !== undefined) {
        ctx.fillStyle = '#FCD34D';
        ctx.font = '10px Arial';
        const dist = distances[node.value] === Infinity ? '∞' : distances[node.value];
        ctx.fillText(dist.toString(), node.x, node.y + 25);
      }
    });

  }, [nodes, edges, visitedNodes, queue, stack, selectedAlgorithm, distances, mstEdges, graphType]);

  // Fixed Event Handlers
  const handleCanvasClick = (e) => {
    if (isAnimating) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvas.offsetWidth;
    const scaleY = canvas.height / canvas.offsetHeight;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 20;
    });

    setSelectedNode(clickedNode ? clickedNode.id : null);
  };

  const handleMouseDown = (e) => {
    if (isAnimating) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvas.offsetWidth;
    const scaleY = canvas.height / canvas.offsetHeight;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 20;
    });

    if (clickedNode) {
      setDraggedNode(clickedNode.id);
    }
  };

  const handleMouseMove = (e) => {
    if (draggedNode && !isAnimating) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / canvas.offsetWidth;
      const scaleY = canvas.height / canvas.offsetHeight;
      
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      setNodes(prev => prev.map(node => 
        node.id === draggedNode ? { ...node, x, y } : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (nodeValue) addNode();
      else if (edgeSource || edgeTarget) addEdge();
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🕸️ Graph Algorithms Visualizer</h2>
      
      {/* Controls */}
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        {/* Graph Type */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-2 bg-gray-600 p-1 rounded-lg">
            {['directed', 'undirected'].map(type => (
              <button
                key={type}
                onClick={() => setGraphType(type)}
                className={`px-4 py-2 rounded transition-colors ${
                  graphType === type 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-500 text-gray-300 hover:bg-gray-400'
                }`}
              >
                {type === 'directed' ? 'Directed' : 'Undirected'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
          {/* Add Node */}
          <div className="flex items-center gap-2 bg-gray-600 p-2 rounded-lg">
            <input
              type="text"
              value={nodeValue}
              onChange={(e) => setNodeValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Node name"
              className="px-3 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
              disabled={isAnimating}
            />
            <button
              onClick={addNode}
              disabled={isAnimating}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
            >
              Add Node
            </button>
          </div>
          
          {/* Add Edge */}
          <div className="flex items-center gap-2 bg-gray-600 p-2 rounded-lg">
            <input
              type="text"
              value={edgeSource}
              onChange={(e) => setEdgeSource(e.target.value)}
              placeholder="From"
              className="px-2 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-12 text-center"
              disabled={isAnimating}
            />
            <span className="text-gray-300">→</span>
            <input
              type="text"
              value={edgeTarget}
              onChange={(e) => setEdgeTarget(e.target.value)}
              placeholder="To"
              className="px-2 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-12 text-center"
              disabled={isAnimating}
            />
            <input
              type="number"
              value={edgeWeight}
              onChange={(e) => setEdgeWeight(e.target.value)}
              placeholder="Wt"
              className="px-2 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 w-12 text-center"
              disabled={isAnimating}
              min="1"
            />
            <button
              onClick={addEdge}
              disabled={isAnimating}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
            >
              Add Edge
            </button>
          </div>
        </div>

        {/* Algorithms */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
          <button onClick={animateBFS} disabled={isAnimating} className="algorithm-btn bg-purple-500">
            🧭 BFS
          </button>
          <button onClick={animateDFS} disabled={isAnimating} className="algorithm-btn bg-pink-500">
            🔍 DFS
          </button>
          <button onClick={animateDijkstra} disabled={isAnimating} className="algorithm-btn bg-yellow-500">
            📍 Dijkstra
          </button>
          <button onClick={animatePrim} disabled={isAnimating} className="algorithm-btn bg-green-500">
            🌳 Prim's
          </button>
          <button onClick={animateKruskal} disabled={isAnimating} className="algorithm-btn bg-indigo-500">
            🔗 Kruskal's
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={clearGraph}
            disabled={isAnimating}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Clear Graph
          </button>
          
          <span className="text-gray-300 text-sm">Speed:</span>
          <input
            type="range"
            min="500"
            max="2000"
            step="100"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="w-32"
            disabled={isAnimating}
          />
          <span className="text-gray-300 text-sm font-mono">
            {animationSpeed}ms
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Graph Canvas */}
        <div className="bg-gray-900 p-4 rounded-lg flex-1">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="border border-gray-600 rounded bg-gray-850 cursor-pointer w-full"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          {nodes.length === 0 && (
            <div className="text-center text-gray-400 mt-4">
              <div className="text-2xl mb-2">🌐</div>
              <div>Add nodes and edges to start visualizing</div>
            </div>
          )}
        </div>

        {/* Algorithm Panel */}
        <div className="bg-gray-900 p-4 rounded-lg w-full lg:w-80">
          <h3 className="text-white font-bold mb-4 text-center">
            {selectedAlgorithm ? {
              'bfs': '🧭 BFS Traversal',
              'dfs': '🔍 DFS Traversal', 
              'dijkstra': '📍 Dijkstra\'s Algorithm',
              'prim': '🌳 Prim\'s Algorithm',
              'kruskal': '🔗 Kruskal\'s Algorithm'
            }[selectedAlgorithm] : 'Algorithm Panel'}
          </h3>

          {currentStep && (
            <div className="mb-4 p-3 bg-blue-600 rounded-lg text-white text-center border-2 border-blue-400">
              <div className="text-sm">{currentStep}</div>
            </div>
          )}

          {/* Queue/Stack Display */}
          {(queue.length > 0 || stack.length > 0) && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">
                {selectedAlgorithm === 'bfs' ? '📊 Queue:' : '📚 Stack:'}
              </h4>
              <div className="flex flex-wrap gap-1">
                {(selectedAlgorithm === 'bfs' ? queue : [...stack].reverse()).map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-yellow-500 text-white rounded text-sm font-bold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {traversalResult.length > 0 && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">🎯 Traversal Order:</h4>
              <div className="flex flex-wrap gap-1">
                {traversalResult.map((node, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
                    {node}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Execution History */}
          <div className="max-h-48 overflow-y-auto">
            <h4 className="text-white font-semibold mb-2">📖 Steps:</h4>
            <div className="space-y-1">
              {executionHistory.map((step, i) => (
                <div key={i} className="p-2 bg-gray-800 rounded text-xs text-gray-300 border-l-2 border-blue-400">
                  {step.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .algorithm-btn {
          padding: 8px 12px;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }
        .algorithm-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .algorithm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default GraphVisualizer;