import React, { useState } from 'react';

const BinaryTree = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);
  const [currentTraversalType, setCurrentTraversalType] = useState('');
  const [callStack, setCallStack] = useState([]);
  const [currentFunction, setCurrentFunction] = useState('');
  const [executionHistory, setExecutionHistory] = useState([]);

  // Insert node into binary tree
  const insertNode = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      alert('Please enter a valid number');
      return;
    }

    const newNode = { value: numValue, left: null, right: null };
    
    if (!tree) {
      setTree(newNode);
    } else {
      const insertRecursive = (node, newNode) => {
        if (newNode.value < node.value) {
          if (node.left === null) {
            node.left = newNode;
          } else {
            insertRecursive(node.left, newNode);
          }
        } else {
          if (node.right === null) {
            node.right = newNode;
          } else {
            insertRecursive(node.right, newNode);
          }
        }
      };
      
      const newTree = JSON.parse(JSON.stringify(tree));
      insertRecursive(newTree, newNode);
      setTree(newTree);
    }
  };

  // Handle insert button click
  const handleInsert = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a number');
      return;
    }
    insertNode(inputValue);
    setInputValue('');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInsert();
    }
  };

  // Clear tree function
  const clearTree = () => {
    setTree(null);
    setTraversalResult([]);
    setCurrentTraversalType('');
    setCallStack([]);
    setCurrentFunction('');
    setExecutionHistory([]);
  };

  // Update call stack visualization with detailed information
  const updateCallStack = (action, nodeValue, details = {}) => {
    const { step = '', direction = '', isBaseCase = false, returnValue = '' } = details;
    
    switch (action) {
      case 'push':
        const stackFrame = {
          node: nodeValue,
          step,
          direction,
          isBaseCase,
          timestamp: new Date().toLocaleTimeString(),
          memoryAddress: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
          localVariables: {
            currentNode: nodeValue,
            leftDone: false,
            rightDone: false
          }
        };
        setCallStack(prev => [...prev, stackFrame]);
        break;
      case 'pop':
        setCallStack(prev => {
          const newStack = prev.slice(0, -1);
          // Update history with the popped frame
          if (prev.length > 0) {
            const poppedFrame = prev[prev.length - 1];
            setExecutionHistory(prevHistory => [{
              ...poppedFrame,
              action: 'returned',
              returnValue: returnValue || 'void',
              endTime: new Date().toLocaleTimeString()
            }, ...prevHistory.slice(0, 9)]); // Keep last 10 history items
          }
          return newStack;
        });
        break;
      case 'process':
        setCurrentFunction(`📝 Processing Node: ${nodeValue}`);
        // Add to execution history
        setExecutionHistory(prev => [{
          node: nodeValue,
          action: 'processed',
          timestamp: new Date().toLocaleTimeString(),
          description: `Node ${nodeValue} added to traversal result`
        }, ...prev.slice(0, 9)]);
        setTimeout(() => setCurrentFunction(''), animationSpeed / 2);
        break;
      case 'update':
        // Update the top frame of the stack
        setCallStack(prev => {
          if (prev.length === 0) return prev;
          const updatedStack = [...prev];
          const topFrame = { ...updatedStack[updatedStack.length - 1] };
          topFrame.step = step;
          topFrame.direction = direction;
          topFrame.localVariables = { 
            ...topFrame.localVariables,
            ...details.localVariables 
          };
          updatedStack[updatedStack.length - 1] = topFrame;
          return updatedStack;
        });
        break;
      default:
        break;
    }
  };

  // Inorder Traversal with Detailed Call Stack
  const animateInorder = () => {
    if (!tree) {
      alert('Tree is empty!');
      return;
    }
    
    setIsAnimating(true);
    setTraversalResult([]);
    setCurrentTraversalType('inorder');
    setCallStack([]);
    setCurrentFunction('');
    setExecutionHistory([]);
    
    const nodes = [];
    const steps = [];
    
    const collectInorder = (node) => {
      if (node) {
        // Step 1: Enter function and go left
        steps.push({
          type: 'push',
          node: node.value,
          message: `🏁 Entering traverse(${node.value})`,
          details: { step: 'Starting', direction: 'Entering function' }
        });
        
        steps.push({
          type: 'update',
          node: node.value,
          message: `⬅️ Checking left subtree of ${node.value}`,
          details: { step: 'Go Left', direction: 'Left', localVariables: { leftDone: false } }
        });
        
        collectInorder(node.left);
        
        steps.push({
          type: 'update',
          node: node.value,
          message: `✅ Returned from left of ${node.value}`,
          details: { step: 'Process', direction: 'Returned Left', localVariables: { leftDone: true } }
        });
        
        // Step 2: Process current node
        steps.push({
          type: 'process', 
          node: node.value,
          message: `📝 Processing node ${node.value} (INORDER)`,
          details: { step: 'Visit Node' }
        });
        
        nodes.push(node);
        
        steps.push({
          type: 'update',
          node: node.value,
          message: `➡️ Checking right subtree of ${node.value}`,
          details: { step: 'Go Right', direction: 'Right', localVariables: { rightDone: false } }
        });
        
        collectInorder(node.right);
        
        steps.push({
          type: 'update',
          node: node.value,
          message: `✅ Returned from right of ${node.value}`,
          details: { step: 'Complete', direction: 'Returned Right', localVariables: { rightDone: true } }
        });
        
        // Step 3: Exit function
        steps.push({
          type: 'pop',
          node: node.value,
          message: `🏁 Exiting traverse(${node.value}) - All children processed`,
          details: { step: 'Return', returnValue: 'Completed' }
        });
      } else {
        // Base case: null node
        steps.push({
          type: 'push',
          node: 'null',
          message: `🚫 Reached null node (Base Case)`,
          details: { step: 'Base Case', direction: 'Leaf', isBaseCase: true }
        });
        steps.push({
          type: 'pop',
          node: 'null',
          message: `↩️ Returning from null (Base Case)`,
          details: { step: 'Return', returnValue: 'null', isBaseCase: true }
        });
      }
    };
    
    collectInorder(tree);

    // Animate the steps
    let stepIndex = 0;
    const animateStep = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        
        switch (step.type) {
          case 'push':
            updateCallStack('push', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          case 'pop':
            updateCallStack('pop', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          case 'process':
            updateCallStack('process', step.node, step.details);
            setTraversalResult(prev => [...prev, step.node]);
            setCurrentFunction(step.message);
            break;
          case 'update':
            updateCallStack('update', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          default:
            break;
        }
        
        stepIndex++;
        setTimeout(animateStep, animationSpeed);
      } else {
        setIsAnimating(false);
        setCurrentFunction('🎉 Traversal Complete! All nodes visited in INORDER sequence');
        setTimeout(() => setCurrentFunction(''), 3000);
      }
    };
    
    animateStep();
  };

  // Preorder Traversal with Detailed Call Stack
  const animatePreorder = () => {
    if (!tree) {
      alert('Tree is empty!');
      return;
    }
    
    setIsAnimating(true);
    setTraversalResult([]);
    setCurrentTraversalType('preorder');
    setCallStack([]);
    setCurrentFunction('');
    setExecutionHistory([]);
    
    const nodes = [];
    const steps = [];
    
    const collectPreorder = (node) => {
      if (node) {
        // Enter function
        steps.push({
          type: 'push',
          node: node.value,
          message: `🏁 Entering traverse(${node.value}) - PREORDER`,
          details: { step: 'Starting', direction: 'Entering function' }
        });
        
        // Process current node first
        steps.push({
          type: 'process',
          node: node.value,
          message: `📝 Processing node ${node.value} (PREORDER - Root First)`,
          details: { step: 'Visit Node' }
        });
        nodes.push(node);
        
        // Go left
        steps.push({
          type: 'update',
          node: node.value,
          message: `⬅️ Going to left child of ${node.value}`,
          details: { step: 'Go Left', direction: 'Left' }
        });
        collectPreorder(node.left);
        steps.push({
          type: 'update',
          node: node.value,
          message: `✅ Returned from left of ${node.value}`,
          details: { step: 'Left Complete', direction: 'Returned Left' }
        });
        
        // Go right
        steps.push({
          type: 'update',
          node: node.value,
          message: `➡️ Going to right child of ${node.value}`,
          details: { step: 'Go Right', direction: 'Right' }
        });
        collectPreorder(node.right);
        steps.push({
          type: 'update',
          node: node.value,
          message: `✅ Returned from right of ${node.value}`,
          details: { step: 'Right Complete', direction: 'Returned Right' }
        });
        
        // Exit
        steps.push({
          type: 'pop',
          node: node.value,
          message: `🏁 Exiting traverse(${node.value}) - PREORDER complete`,
          details: { step: 'Return', returnValue: 'Completed' }
        });
      } else {
        // Base case
        steps.push({
          type: 'push',
          node: 'null',
          message: `🚫 Base case: null node reached`,
          details: { step: 'Base Case', isBaseCase: true }
        });
        steps.push({
          type: 'pop',
          node: 'null',
          message: `↩️ Returning from base case`,
          details: { step: 'Return', returnValue: 'null', isBaseCase: true }
        });
      }
    };
    
    collectPreorder(tree);

    // Animate the steps
    let stepIndex = 0;
    const animateStep = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        
        switch (step.type) {
          case 'push':
            updateCallStack('push', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          case 'pop':
            updateCallStack('pop', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          case 'process':
            updateCallStack('process', step.node, step.details);
            setTraversalResult(prev => [...prev, step.node]);
            setCurrentFunction(step.message);
            break;
          case 'update':
            updateCallStack('update', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          default:
            break;
        }
        
        stepIndex++;
        setTimeout(animateStep, animationSpeed);
      } else {
        setIsAnimating(false);
        setCurrentFunction('🎉 PREORDER Traversal Complete!');
      }
    };
    
    animateStep();
  };

  // Postorder Traversal with Detailed Call Stack
  const animatePostorder = () => {
    if (!tree) {
      alert('Tree is empty!');
      return;
    }
    
    setIsAnimating(true);
    setTraversalResult([]);
    setCurrentTraversalType('postorder');
    setCallStack([]);
    setCurrentFunction('');
    setExecutionHistory([]);
    
    const nodes = [];
    const steps = [];
    
    const collectPostorder = (node) => {
      if (node) {
        steps.push({
          type: 'push',
          node: node.value,
          message: `🏁 Entering traverse(${node.value}) - POSTORDER`,
          details: { step: 'Starting', direction: 'Entering function' }
        });
        
        // Go left first
        steps.push({
          type: 'update',
          node: node.value,
          message: `⬅️ Visiting left subtree of ${node.value} first`,
          details: { step: 'Go Left', direction: 'Left' }
        });
        collectPostorder(node.left);
        steps.push({
          type: 'update',
          node: node.value,
          message: `✅ Left subtree of ${node.value} completed`,
          details: { step: 'Left Complete', direction: 'Returned Left' }
        });
        
        // Then go right
        steps.push({
          type: 'update',
          node: node.value,
          message: `➡️ Visiting right subtree of ${node.value}`,
          details: { step: 'Go Right', direction: 'Right' }
        });
        collectPostorder(node.right);
        steps.push({
          type: 'update',
          node: node.value,
          message: `✅ Right subtree of ${node.value} completed`,
          details: { step: 'Right Complete', direction: 'Returned Right' }
        });
        
        // Process node last
        steps.push({
          type: 'process',
          node: node.value,
          message: `📝 Processing node ${node.value} (POSTORDER - Root Last)`,
          details: { step: 'Visit Node' }
        });
        nodes.push(node);
        
        steps.push({
          type: 'pop',
          node: node.value,
          message: `🏁 Exiting traverse(${node.value}) - POSTORDER complete`,
          details: { step: 'Return', returnValue: 'Completed' }
        });
      } else {
        steps.push({
          type: 'push',
          node: 'null',
          message: `🚫 Base case: null node`,
          details: { step: 'Base Case', isBaseCase: true }
        });
        steps.push({
          type: 'pop',
          node: 'null',
          message: `↩️ Returning from base case`,
          details: { step: 'Return', returnValue: 'null', isBaseCase: true }
        });
      }
    };
    
    collectPostorder(tree);

    // Animate the steps
    let stepIndex = 0;
    const animateStep = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        
        switch (step.type) {
          case 'push':
            updateCallStack('push', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          case 'pop':
            updateCallStack('pop', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          case 'process':
            updateCallStack('process', step.node, step.details);
            setTraversalResult(prev => [...prev, step.node]);
            setCurrentFunction(step.message);
            break;
          case 'update':
            updateCallStack('update', step.node, step.details);
            setCurrentFunction(step.message);
            break;
          default:
            break;
        }
        
        stepIndex++;
        setTimeout(animateStep, animationSpeed);
      } else {
        setIsAnimating(false);
        setCurrentFunction('🎉 POSTORDER Traversal Complete!');
      }
    };
    
    animateStep();
  };

  // TreeSVG component (same as before)
  const TreeSVG = () => {
    if (!tree) return null;

    const calculateTreeDimensions = (node) => {
      if (!node) return { width: 0, height: 0, leftWidth: 0, rightWidth: 0 };
      const leftDim = calculateTreeDimensions(node.left);
      const rightDim = calculateTreeDimensions(node.right);
      const width = leftDim.width + rightDim.width + 100;
      const height = Math.max(leftDim.height, rightDim.height) + 1;
      return { 
        width: Math.max(80, width),
        height,
        leftWidth: leftDim.width + 50,
        rightWidth: rightDim.width + 50
      };
    };

    const treeDim = calculateTreeDimensions(tree);
    const svgWidth = Math.max(800, treeDim.width * 1.5);
    const startX = svgWidth / 2;

    const renderNode = (node, x, y, level = 0) => {
      if (!node) return null;

      const baseSpacing = 150;
      const levelReduction = level * 15;
      const horizontalSpacing = Math.max(80, baseSpacing - levelReduction);
      const verticalSpacing = 90;

      const leftDim = calculateTreeDimensions(node.left);
      const rightDim = calculateTreeDimensions(node.right);

      const leftX = x - Math.max(horizontalSpacing, leftDim.rightWidth);
      const rightX = x + Math.max(horizontalSpacing, rightDim.leftWidth);

      return (
        <g key={`${node.value}-${x}-${y}`}>
          {node.left && (
            <line
              x1={x}
              y1={y + 20}
              x2={leftX}
              y2={y + verticalSpacing - 20}
              stroke="#60A5FA"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )}
          {node.right && (
            <line
              x1={x}
              y1={y + 20}
              x2={rightX}
              y2={y + verticalSpacing - 20}
              stroke="#60A5FA"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )}
          <circle
            cx={x}
            cy={y}
            r="20"
            fill={traversalResult.includes(node.value) ? "#EF4444" : "#3B82F6"}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dy=".3em"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            className="select-none"
          >
            {node.value}
          </text>
          {node.left && renderNode(node.left, leftX, y + verticalSpacing, level + 1)}
          {node.right && renderNode(node.right, rightX, y + verticalSpacing, level + 1)}
        </g>
      );
    };

    return (
      <div className="w-full flex justify-center overflow-auto">
        <svg 
          width={svgWidth} 
          height="400"
          className="border border-gray-600 rounded bg-gray-850"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#60A5FA" />
            </marker>
          </defs>
          {renderNode(tree, startX, 60)}
        </svg>
      </div>
    );
  };

  // Get traversal label
  const getTraversalLabel = () => {
    switch (currentTraversalType) {
      case 'inorder':
        return 'Inorder Traversal';
      case 'preorder':
        return 'Preorder Traversal';
      case 'postorder':
        return 'Postorder Traversal';
      default:
        return 'Traversal Order';
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🌳 Binary Tree Visualizer</h2>
      
      {/* Controls */}
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-center mb-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter node value"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
          />
          <button
            onClick={handleInsert}
            disabled={isAnimating}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Insert
          </button>
          <button
            onClick={clearTree}
            disabled={isAnimating}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Clear Tree
          </button>
        </div>

        {/* Traversal Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <button
            onClick={animateInorder}
            disabled={isAnimating}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            Inorder
          </button>
          <button
            onClick={animatePreorder}
            disabled={isAnimating}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            Preorder
          </button>
          <button
            onClick={animatePostorder}
            disabled={isAnimating}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            Postorder
          </button>
        </div>

        {/* Animation Speed Control - Extended to 4 seconds */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-gray-300 text-sm">Speed:</span>
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="w-48"
            disabled={isAnimating}
          />
          <span className="text-gray-300 text-sm font-mono">
            {animationSpeed}ms
          </span>
        </div>
        <div className="text-center text-gray-400 text-xs mt-2">
          Slow down to see detailed recursion steps (500ms - 4000ms)
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Tree Visualization */}
        <div className="bg-gray-900 p-4 rounded-lg flex-1 min-h-64">
          {tree ? (
            <TreeSVG />
          ) : (
            <div className="text-gray-400 text-center py-16">
              Tree is empty. Insert nodes to visualize.
            </div>
          )}
        </div>

        {/* Enhanced Call Stack Visualization */}
        <div className="bg-gray-900 p-4 rounded-lg w-full xl:w-96">
          <h3 className="text-white font-bold mb-4 text-center">🔄 Recursion Call Stack</h3>
          
          {/* Current Function Display */}
          {currentFunction && (
            <div className="mb-4 p-3 bg-blue-600 rounded-lg text-white text-center animate-pulse border-2 border-blue-400">
              <strong>🔍 Current Action:</strong><br/>
              <span className="text-sm">{currentFunction}</span>
            </div>
          )}

          {/* Call Stack Display */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2">📚 Active Stack Frames:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-600 rounded-lg p-2">
              {callStack.length === 0 ? (
                <div className="text-gray-400 text-center py-4 text-sm">
                  Stack is empty - No active function calls
                </div>
              ) : (
                callStack.map((frame, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-white text-sm ${
                      index === callStack.length - 1 
                        ? 'bg-green-600 border-2 border-green-400 shadow-lg' 
                        : 'bg-gray-700 border border-gray-500'
                    } transition-all duration-300`}
                  >
                    <div className="font-mono font-bold">
                      traverse({frame.node})
                      {frame.isBaseCase && <span className="ml-2 text-yellow-300">🚫 BASE CASE</span>}
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Step: {frame.step}</span>
                      <span className={`px-2 py-1 rounded ${
                        frame.direction === 'Left' ? 'bg-blue-500' :
                        frame.direction === 'Right' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}>
                        {frame.direction || 'Processing'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 mt-1 grid grid-cols-2 gap-1">
                      <div>Stack Level: {index + 1}</div>
                      <div>Mem: {frame.memoryAddress}</div>
                      <div>Time: {frame.timestamp}</div>
                      <div>Vars: {frame.localVariables?.leftDone ? 'L✓' : 'L⏳'} {frame.localVariables?.rightDone ? 'R✓' : 'R⏳'}</div>
                    </div>
                  </div>
                )).reverse()
              )}
            </div>
          </div>

          {/* Execution History */}
          <div>
            <h4 className="text-white font-semibold mb-2">📖 Recent Execution History:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
              {executionHistory.length === 0 ? (
                <div className="text-gray-400 text-center py-2">
                  No execution history yet
                </div>
              ) : (
                executionHistory.map((item, index) => (
                  <div key={index} className="p-2 bg-gray-800 rounded border-l-4 border-blue-400">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {item.action === 'processed' ? '📝 Processed' : 
                         item.action === 'returned' ? '↩️ Returned' : '⚡ Action'}
                      </span>
                      <span className="text-gray-400">{item.timestamp}</span>
                    </div>
                    <div className="text-gray-300">
                      {item.action === 'processed' ? `Node ${item.node} visited` :
                       item.action === 'returned' ? `traverse(${item.node}) returned ${item.returnValue}` :
                       item.description}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stack Info */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div>
                <span className="font-semibold">Stack Size:</span>
                <span className="ml-2 font-bold text-white">{callStack.length}</span>
              </div>
              <div>
                <span className="font-semibold">Max Depth:</span>
                <span className="ml-2 font-bold text-white">
                  {callStack.length > 0 ? Math.max(...callStack.map((_, i) => i + 1)) : 0}
                </span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Active Frame (Top of Stack)</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span>Waiting Frames</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traversal Result Display */}
      {traversalResult.length > 0 && (
        <div className="mt-4 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-white font-bold mb-2">
            {getTraversalLabel()}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {traversalResult.map((value, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg font-bold animate-pulse"
              >
                {value}
              </span>
            ))}
          </div>
          <div className="mt-2 text-gray-300 text-sm">
            <strong>Path:</strong> {traversalResult.join(' → ')}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-gray-300 text-sm bg-gray-700 p-3 rounded-lg">
        <div className="text-center">
          <strong>💡 Enhanced Recursion Visualization:</strong>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active Function Call</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span>Waiting Function Call</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-blue-400"></div>
              <span>Function Call Order</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Base Case Reached</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTree;