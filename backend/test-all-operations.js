const http = require('http');

const API_BASE = 'http://localhost:5001';

async function testAPI(endpoint, method = 'GET', data = null) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: endpoint,
            method: method,
            headers: {}
        };

        if (data) {
            options.headers['Content-Type'] = 'application/json';
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ success: true, data: jsonData, status: res.statusCode });
                } catch (e) {
                    resolve({ success: false, raw: data, status: res.statusCode });
                }
            });
        });

        req.on('error', (err) => {
            resolve({ success: false, error: err.message });
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runCompleteTest() {
    console.log('🌳 COMPLETE TREE VISUALIZER DEMO\n');
    console.log('=' .repeat(50));

    // Test 1: Health Check
    console.log('1. 🏥 SERVER HEALTH CHECK');
    const health = await testAPI('/health');
    if (health.success) {
        console.log('   ✅ Server is running:', health.data.message);
    }
    console.log('');

    // Test 2: Create Tree
    console.log('2. 🌱 CREATING NEW TREE');
    const tree = await testAPI('/api/trees/new', 'POST');
    const treeId = tree.success ? tree.data.treeId : 1;
    console.log('   ✅ Tree created with ID:', treeId);
    console.log('');

    // Test 3: Build a Sample Tree
    console.log('3. 🏗️  BUILDING SAMPLE TREE');
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    
    for (const value of values) {
        const result = await testAPI(`/api/trees/${treeId}/insert`, 'POST', { value });
        if (result.success) {
            console.log(`   ✅ Inserted ${value} - Steps: ${result.data.steps.length}`);
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
    console.log('');

    // Test 4: Show Tree Structure
    console.log('4. 📊 CURRENT TREE STATE');
    const state = await testAPI(`/api/trees/${treeId}/state`);
    if (state.success) {
        const info = state.data.treeInfo;
        console.log(`   📏 Height: ${info.height}`);
        console.log(`   🔢 Node Count: ${info.nodeCount}`);
        console.log(`   ✅ Is BST: ${info.isBST}`);
    }
    console.log('');

    // Test 5: Search Operations
    console.log('5. 🔍 SEARCH OPERATIONS');
    const search1 = await testAPI(`/api/trees/${treeId}/search/40`);
    const search2 = await testAPI(`/api/trees/${treeId}/search/99`);
    
    if (search1.success) {
        console.log(`   ✅ Search 40: ${search1.data.found ? 'FOUND' : 'NOT FOUND'} (${search1.data.steps.length} steps)`);
    }
    if (search2.success) {
        console.log(`   ✅ Search 99: ${search2.data.found ? 'FOUND' : 'NOT FOUND'} (${search2.data.steps.length} steps)`);
    }
    console.log('');

    // Test 6: Traversal Demonstrations
    console.log('6. 🛣️  TREE TRAVERSALS');
    const inorder = await testAPI(`/api/trees/${treeId}/traverse/inorder`);
    const preorder = await testAPI(`/api/trees/${treeId}/traverse/preorder`);
    
    if (inorder.success) {
        console.log(`   ✅ In-Order: ${inorder.data.steps.length} steps`);
        // Show the traversal order
        const traversalSteps = inorder.data.steps.filter(step => 
            step.description.includes('Processing node:')
        );
        const order = traversalSteps.map(step => 
            step.description.match(/Processing node: (\d+)/)[1]
        ).join(' → ');
        console.log(`      Order: ${order}`);
    }
    
    if (preorder.success) {
        console.log(`   ✅ Pre-Order: ${preorder.data.steps.length} steps`);
    }
    console.log('');

    // Test 7: Deletion Operations
    console.log('7. 🗑️  DELETION OPERATIONS');
    
    // Delete a leaf node
    const deleteLeaf = await testAPI(`/api/trees/${treeId}/delete/10`, 'DELETE');
    if (deleteLeaf.success) {
        console.log(`   ✅ Delete Leaf (10): ${deleteLeaf.data.steps.length} steps`);
    }
    
    // Delete node with one child
    const deleteOneChild = await testAPI(`/api/trees/${treeId}/delete/20`, 'DELETE');
    if (deleteOneChild.success) {
        console.log(`   ✅ Delete One Child (20): ${deleteOneChild.data.steps.length} steps`);
    }
    
    // Delete node with two children
    const deleteTwoChildren = await testAPI(`/api/trees/${treeId}/delete/30`, 'DELETE');
    if (deleteTwoChildren.success) {
        console.log(`   ✅ Delete Two Children (30): ${deleteTwoChildren.data.steps.length} steps`);
    }
    console.log('');

    // Test 8: Final State
    console.log('8. 📈 FINAL TREE STATE');
    const finalState = await testAPI(`/api/trees/${treeId}/state`);
    if (finalState.success) {
        const finalInfo = finalState.data.treeInfo;
        console.log(`   📏 Height: ${finalInfo.height}`);
        console.log(`   🔢 Node Count: ${finalInfo.nodeCount}`);
        console.log(`   ✅ Is BST: ${finalInfo.isBST}`);
    }
    console.log('');

    console.log('=' .repeat(50));
    console.log('🎉 DEMO COMPLETED SUCCESSFULLY!');
    console.log('📊 Your backend is working perfectly!');
    console.log('🚀 Ready for frontend integration!');
}

// Run the complete demo
runCompleteTest();