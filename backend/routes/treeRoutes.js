const express = require('express');
const { BinarySearchTree } = require('../algorithms/tree');

const router = express.Router();

// Store trees in memory (for demo purposes)
let trees = new Map();
let currentTreeId = 1;

// Helper to get or create tree
const getTree = (treeId) => {
  if (!trees.has(treeId)) {
    trees.set(treeId, new BinarySearchTree());
  }
  return trees.get(treeId);
};

// Create new tree
router.post('/new', (req, res) => {
  const treeId = currentTreeId++;
  trees.set(treeId, new BinarySearchTree());
  
  res.json({
    success: true,
    treeId,
    message: 'New binary search tree created'
  });
});

// Insert value into tree
router.post('/:treeId/insert', (req, res) => {
  try {
    const { treeId } = req.params;
    const { value } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: 'Value is required'
      });
    }

    const tree = getTree(parseInt(treeId));
    const steps = tree.insert(parseInt(value));
    const treeInfo = tree.getTreeInfo();

    res.json({
      success: true,
      steps,
      treeInfo,
      operationCount: steps[steps.length - 1].operationCount,
      timeComplexity: 'O(h) where h is height of tree',
      message: `Value ${value} inserted successfully`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search for value in tree
router.get('/:treeId/search/:value', (req, res) => {
  try {
    const { treeId, value } = req.params;
    
    const tree = getTree(parseInt(treeId));
    const steps = tree.search(parseInt(value));
    const treeInfo = tree.getTreeInfo();

    res.json({
      success: true,
      steps,
      treeInfo,
      operationCount: steps[steps.length - 1].operationCount,
      timeComplexity: 'O(h) where h is height of tree',
      found: steps[steps.length - 1].description.includes('Found')
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Tree traversals
router.get('/:treeId/traverse/:type', (req, res) => {
  try {
    const { treeId, type } = req.params;
    const tree = getTree(parseInt(treeId));
    
    let steps;
    switch (type) {
      case 'inorder':
        steps = tree.inOrderTraversal();
        break;
      case 'preorder':
        steps = tree.preOrderTraversal();
        break;
      case 'postorder':
        steps = tree.postOrderTraversal();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid traversal type. Use: inorder, preorder, or postorder'
        });
    }

    const treeInfo = tree.getTreeInfo();

    res.json({
      success: true,
      steps,
      treeInfo,
      operationCount: steps[steps.length - 1].operationCount,
      timeComplexity: 'O(n) where n is number of nodes',
      traversalType: type
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get current tree state
router.get('/:treeId/state', (req, res) => {
  try {
    const { treeId } = req.params;
    const tree = getTree(parseInt(treeId));
    const treeInfo = tree.getTreeInfo();

    res.json({
      success: true,
      treeInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear tree
router.delete('/:treeId/clear', (req, res) => {
  try {
    const { treeId } = req.params;
    trees.set(parseInt(treeId), new BinarySearchTree());

    res.json({
      success: true,
      message: 'Tree cleared successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add this route before module.exports:

// Delete value from tree
router.delete('/:treeId/delete/:value', (req, res) => {
    try {
        const { treeId, value } = req.params;
        
        const tree = getTree(parseInt(treeId));
        const steps = tree.delete(parseInt(value));
        const treeInfo = tree.getTreeInfo();

        res.json({
            success: true,
            steps,
            treeInfo,
            operationCount: steps[steps.length - 1].operationCount,
            timeComplexity: 'O(h) where h is height of tree',
            message: `Value ${value} deletion completed`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;