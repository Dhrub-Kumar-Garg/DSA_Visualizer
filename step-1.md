⚙️ Member 2 – Backend + Algorithms <br><br>
🎯 Focus <br>

Tech Stack: Node.js, Express <br>
Core Areas: Data Structures & Algorithms (Trees + Graphs) <br><br>
Your mission is to implement all algorithmic logic and build the backend that communicates with the frontend — transforming algorithm steps into visually understandable data. <br><br>

🧠 Responsibilities <br><br>
🖥️ Backend Setup <br>

• Initialize and configure an Express.js server <br>
• Create and manage routes such as: <br>
    – /insert <br>
    – /delete <br>
    – /traverse <br>
    – /runAlgorithm <br><br>

🌳 Tree Logic <br>

• Implement core classes: Node, BinaryTree, BinarySearchTree <br>
• Add functionalities: <br>
    – Insertion <br>
    – Deletion <br>
    – Traversals (Inorder, Preorder, Postorder) <br>
• Each operation should return stepwise logs for frontend visualization. <br><br>

🕸️ Graph Logic <br>

• Implement algorithms: BFS, DFS, Dijkstra, Prim, Kruskal <br>
• Maintain step-by-step state tracking: <br>
    – Visited nodes <br>
    – Edge relaxations <br>
    – Path updates <br><br>

🔌 API Design <br>

• Design endpoints that return algorithm “step arrays” to the frontend for animation <br>
• Include time complexity and operation count tracking for each algorithm <br><br>

🧪 Testing & Integration <br>

• Test all endpoints using Postman or simple frontend requests <br>
• Ensure smooth communication between backend and frontend modules <br><br>

🎓 Learning Outcome <br>

By completing this module, you will: <br>
• Master DSA implementation in JavaScript <br>
• Gain hands-on experience with API design and data flow <br>
• Build strong logical structuring and debugging skills <br>
• Strengthen your foundation for technical interviews and system design <br><br>
**🧠 Member 2 — Backend + Algorithms Roadmap**<br><br>
🎯 Your Goal <br>

To build the logical brain of the project — implementing DSA algorithms in JavaScript (Node.js) and designing APIs that send step-by-step algorithm states to the frontend for visualization. <br><br>

🧩 Step 0: Prerequisites Before Starting <br><br>

Before we begin, make sure you’re comfortable with the following: <br><br>

🧰 1. Technical Tools <br>
Skill	What to Know	Resources<br>
Node.js + npm	Installing packages, running servers, using npm start	nodejs.org<br>

Express.js	Creating REST APIs, routes (app.get, app.post)	Express Docs<br>

JavaScript (ES6)	Classes, arrays, maps, sets, spread/rest operators	MDN JS Guide<br>

Git + GitHub	Clone, push, pull, branch, commit	Git Handbook<br>

Postman / Thunder Client (VS Code)	Test APIs easily	Postman Docs <br>
💡 2. DSA Topics to Review <br>

You don’t need to master everything first — but review the logic behind these as you’ll implement them: <br><br>

Category	Concepts<br>
Linear DS	Stack, Queue, Linked List<br>
Non-linear DS	Trees (BST)<br>
Algorithms	Sorting, Searching, Graph Traversals (BFS, DFS)<br>
Algorithm Analysis	Time complexity basics<br>
🧠 3. Folder Structure (for backend) <br>

Create this inside your main repo: <br><br>

backend/<br>
│<br>
├── package.json<br>
├── server.js                # Entry point<br>
├── routes/<br>
│   ├── stackRoutes.js <br>
│   ├── queueRoutes.js<br>
│   ├── sortRoutes.js<br>
│   ├── searchRoutes.js<br>
│   ├── treeRoutes.js<br>
│   └── graphRoutes.js<br>
├── algorithms/<br>
│   ├── stack.js<br>
│   ├── queue.js<br>
│   ├── sorting.js<br>
│   ├── searching.js<br>
│   ├── tree.js<br>
│   └── graph.js<br>
└── utils/<br>
    └── complexity.js        # (optional) for measuring steps/time<br>

<br>
