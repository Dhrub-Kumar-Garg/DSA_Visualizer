class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.steps = [];
    this.operationCount = 0;
  }

  // Helper to add step for visualization
  addStep(description, currentNode = null, treeState = null) {
    this.steps.push({
      step: this.steps.length + 1,
      description,
      currentNode: currentNode ? currentNode.id : null,
      treeState: treeState || this.serializeTree(),
      operationCount: this.operationCount
    });
  }

  // Serialize tree for frontend
  serializeTree(node = this.root) {
    if (!node) return null;
    
    return {
      id: node.id,
      value: node.value,
      left: this.serializeTree(node.left),
      right: this.serializeTree(node.right)
    };
  }

  // Insert with step tracking
  insert(value) {
    this.steps = [];
    this.operationCount = 0;
    
    const newNode = new TreeNode(value);
    this.addStep(`Starting insertion of value: ${value}`, newNode);

    if (!this.root) {
      this.root = newNode;
      this.addStep(`Tree was empty. Set ${value} as root`, newNode);
      return this.steps;
    }

    this._insertNode(this.root, newNode);
    return this.steps;
  }

  _insertNode(node, newNode) {
    this.operationCount++;
    
    if (newNode.value < node.value) {
      this.addStep(`Comparing ${newNode.value} with ${node.value}. Going LEFT`, node);
      
      if (!node.left) {
        node.left = newNode;
        this.addStep(`Found empty left child. Inserting ${newNode.value}`, newNode);
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      this.addStep(`Comparing ${newNode.value} with ${node.value}. Going RIGHT`, node);
      
      if (!node.right) {
        node.right = newNode;
        this.addStep(`Found empty right child. Inserting ${newNode.value}`, newNode);
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  // Search with step tracking
  search(value) {
    this.steps = [];
    this.operationCount = 0;
    this.addStep(`Starting search for value: ${value}`);
    
    const result = this._searchNode(this.root, value);
    
    if (result) {
      this.addStep(`Found value ${value} in the tree`, result);
    } else {
      this.addStep(`Value ${value} not found in the tree`);
    }
    
    return this.steps;
  }

  _searchNode(node, value) {
    if (!node) return null;

    this.operationCount++;
    this.addStep(`Comparing ${value} with current node value: ${node.value}`, node);

    if (value === node.value) {
      return node;
    } else if (value < node.value) {
      this.addStep(`${value} < ${node.value}. Searching left subtree`, node);
      return this._searchNode(node.left, value);
    } else {
      this.addStep(`${value} > ${node.value}. Searching right subtree`, node);
      return this._searchNode(node.right, value);
    }
  }

  // Traversals with step tracking
  inOrderTraversal() {
    this.steps = [];
    this.operationCount = 0;
    this.addStep("Starting In-Order Traversal (Left, Root, Right)");
    
    this._inOrder(this.root);
    this.addStep("In-Order Traversal completed");
    
    return this.steps;
  }

  _inOrder(node) {
    if (!node) return;

    this.addStep(`Visiting left subtree of node: ${node.value}`, node);
    this._inOrder(node.left);

    this.operationCount++;
    this.addStep(`Processing node: ${node.value}`, node);

    this.addStep(`Visiting right subtree of node: ${node.value}`, node);
    this._inOrder(node.right);
  }

  preOrderTraversal() {
    this.steps = [];
    this.operationCount = 0;
    this.addStep("Starting Pre-Order Traversal (Root, Left, Right)");
    
    this._preOrder(this.root);
    this.addStep("Pre-Order Traversal completed");
    
    return this.steps;
  }

  _preOrder(node) {
    if (!node) return;

    this.operationCount++;
    this.addStep(`Processing node: ${node.value}`, node);

    this.addStep(`Visiting left subtree of node: ${node.value}`, node);
    this._preOrder(node.left);

    this.addStep(`Visiting right subtree of node: ${node.value}`, node);
    this._preOrder(node.right);
  }

  postOrderTraversal() {
    this.steps = [];
    this.operationCount = 0;
    this.addStep("Starting Post-Order Traversal (Left, Right, Root)");
    
    this._postOrder(this.root);
    this.addStep("Post-Order Traversal completed");
    
    return this.steps;
  }

  _postOrder(node) {
    if (!node) return;

    this.addStep(`Visiting left subtree of node: ${node.value}`, node);
    this._postOrder(node.left);

    this.addStep(`Visiting right subtree of node: ${node.value}`, node);
    this._postOrder(node.right);

    this.operationCount++;
    this.addStep(`Processing node: ${node.value}`, node);
  }

  // Get tree info
  getTreeInfo() {
    return {
      height: this._getHeight(this.root),
      nodeCount: this._countNodes(this.root),
      isBST: this._isValidBST(this.root),
      serializedTree: this.serializeTree()
    };
  }

  _getHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
  }

  _countNodes(node) {
    if (!node) return 0;
    return 1 + this._countNodes(node.left) + this._countNodes(node.right);
  }

  _isValidBST(node, min = -Infinity, max = Infinity) {
    if (!node) return true;
    if (node.value <= min || node.value >= max) return false;
    return this._isValidBST(node.left, min, node.value) && 
           this._isValidBST(node.right, node.value, max);
  }

  // Add these methods to your BinarySearchTree class:

// Delete method with step tracking
delete(value) {
    this.steps = [];
    this.operationCount = 0;
    this.addStep(`Starting deletion of value: ${value}`);
    
    this.root = this._deleteNode(this.root, value);
    
    if (this.steps[this.steps.length - 1].description.includes('not found')) {
        this.addStep(`Deletion failed: Value ${value} not found in tree`);
    } else {
        this.addStep(`Deletion completed: Value ${value} removed from tree`);
    }
    
    return this.steps;
}

_deleteNode(node, value) {
    if (!node) {
        this.addStep(`Reached null node - value ${value} not found`);
        return null;
    }

    this.operationCount++;
    this.addStep(`Comparing ${value} with current node: ${node.value}`, node);

    if (value < node.value) {
        this.addStep(`${value} < ${node.value} - Searching in left subtree`, node);
        node.left = this._deleteNode(node.left, value);
    } else if (value > node.value) {
        this.addStep(`${value} > ${node.value} - Searching in right subtree`, node);
        node.right = this._deleteNode(node.right, value);
    } else {
        // Node to delete found
        this.addStep(`🎯 Found node to delete: ${value}`, node);
        
        // Case 1: No children (leaf node)
        if (!node.left && !node.right) {
            this.addStep(`Case 1: Node ${value} is a leaf - simple deletion`, node);
            return null;
        }
        // Case 2: Only one child
        else if (!node.left) {
            this.addStep(`Case 2: Node ${value} has only right child - replacing with right child`, node);
            return node.right;
        } else if (!node.right) {
            this.addStep(`Case 3: Node ${value} has only left child - replacing with left child`, node);
            return node.left;
        }
        // Case 3: Two children
        else {
            this.addStep(`Case 4: Node ${value} has two children - finding inorder successor`, node);
            
            // Find the smallest value in right subtree (inorder successor)
            const successor = this._findMin(node.right);
            this.addStep(`Inorder successor found: ${successor.value}`, successor);
            
            // Replace value with successor value
            this.addStep(`Replacing ${node.value} with successor value ${successor.value}`, node);
            node.value = successor.value;
            
            // Delete the successor
            this.addStep(`Now deleting the successor node ${successor.value} from right subtree`, node);
            node.right = this._deleteNode(node.right, successor.value);
        }
    }
    
    return node;
}

_findMin(node) {
    this.addStep(`Finding minimum value in subtree rooted at ${node.value}`, node);
    while (node.left) {
        node = node.left;
        this.addStep(`Moving to left child: ${node.value}`, node);
    }
    this.addStep(`Minimum value found: ${node.value}`, node);
    return node;
}
}

module.exports = { BinarySearchTree, TreeNode };