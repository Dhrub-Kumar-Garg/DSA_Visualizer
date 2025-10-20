#!/bin/bash

echo "🌳 COMPLETE TREE VISUALIZER API TEST"
echo "======================================"

# Test 1: Health Check
echo "1. ✅ Health Check:"
curl -s http://localhost:5001/health
echo ""
echo ""

# Test 2: Main Endpoint
echo "2. ✅ Main Endpoint:"
curl -s http://localhost:5001/
echo ""
echo ""

# Test 3: Create New Tree
echo "3. ✅ Create New Tree:"
curl -s -X POST http://localhost:5001/api/trees/new
echo ""
echo ""

# Test 4: Insert Multiple Values
echo "4. ✅ Insert Values into Tree:"
for value in 10 5 15 3 7 12 20; do
  echo "   Inserting $value:"
  curl -s -X POST http://localhost:5001/api/trees/1/insert \
    -H "Content-Type: application/json" \
    -d "{\"value\": $value}"
  echo ""
  echo ""
done

# Test 5: Search for Values
echo "5. ✅ Search Operations:"
echo "   Searching for 7 (should be found):"
curl -s http://localhost:5001/api/trees/1/search/7
echo ""
echo "   Searching for 99 (should not be found):"
curl -s http://localhost:5001/api/trees/1/search/99
echo ""
echo ""

# Test 6: Tree Traversals
echo "6. ✅ Tree Traversals:"
echo "   In-Order Traversal:"
curl -s http://localhost:5001/api/trees/1/traverse/inorder
echo ""
echo ""

echo "   Pre-Order Traversal:"
curl -s http://localhost:5001/api/trees/1/traverse/preorder
echo ""
echo ""

# Test 7: Get Tree State
echo "7. ✅ Current Tree State:"
curl -s http://localhost:5001/api/trees/1/state
echo ""
echo ""

echo "🎊 BACKEND TESTING COMPLETE!"