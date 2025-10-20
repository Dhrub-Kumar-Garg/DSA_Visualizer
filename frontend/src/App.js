import React, { useState } from "react";
import BinaryTree from "./components/BinaryTree";
import GraphVisualizer from "./components/GraphVisualizer";

function App() {
  const [activeTab, setActiveTab] = useState("tree"); // default tab

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">🚀 DSA Visualizer</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "tree" ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("tree")}
        >
          Binary Tree
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "graph" ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("graph")}
        >
          Graph
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 p-6 rounded-b-lg shadow-lg">
        {activeTab === "tree" ? <BinaryTree /> : <GraphVisualizer />}
      </div>
    </div>
  );
}

export default App;
