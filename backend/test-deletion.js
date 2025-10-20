const http = require('http');

const tests = [
    { name: 'Create Tree', path: '/api/trees/new', method: 'POST' },
    { name: 'Insert 10', path: '/api/trees/1/insert', method: 'POST', data: { value: 10 } },
    { name: 'Insert 5', path: '/api/trees/1/insert', method: 'POST', data: { value: 5 } },
    { name: 'Insert 15', path: '/api/trees/1/insert', method: 'POST', data: { value: 15 } },
    { name: 'Insert 3', path: '/api/trees/1/insert', method: 'POST', data: { value: 3 } },
    { name: 'Insert 7', path: '/api/trees/1/insert', method: 'POST', data: { value: 7 } },
    { name: 'Insert 12', path: '/api/trees/1/insert', method: 'POST', data: { value: 12 } },
    { name: 'Insert 20', path: '/api/trees/1/insert', method: 'POST', data: { value: 20 } },
    { name: 'Tree State Before', path: '/api/trees/1/state', method: 'GET' },
    { name: 'DELETE Leaf (3)', path: '/api/trees/1/delete/3', method: 'DELETE' },
    { name: 'DELETE One Child (12)', path: '/api/trees/1/delete/12', method: 'DELETE' },
    { name: 'DELETE Two Children (10)', path: '/api/trees/1/delete/10', method: 'DELETE' },
    { name: 'Tree State After', path: '/api/trees/1/state', method: 'GET' }
];

async function runTest(test) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: test.path,
            method: test.method,
            headers: {}
        };

        if (test.data) {
            options.headers['Content-Type'] = 'application/json';
        }

        console.log(`🔧 ${test.method} ${test.path}`);

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.success) {
                        console.log(`✅ ${test.name}: ${jsonData.message}`);
                        if (jsonData.treeInfo) {
                            console.log(`   📊 Height: ${jsonData.treeInfo.height}, Nodes: ${jsonData.treeInfo.nodeCount}`);
                        }
                    }
                } catch (e) {
                    console.log(`📦 ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            console.log(`❌ ${test.name}: ${err.message}`);
            resolve();
        });

        if (test.data) {
            req.write(JSON.stringify(test.data));
        }

        req.end();
    });
}

async function runAllTests() {
    console.log('🧪 TESTING TREE DELETION OPERATIONS\n');
    
    for (const test of tests) {
        await runTest(test);
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay for visibility
    }
    
    console.log('\n🎉 DELETION TESTING COMPLETED!');
}

runAllTests();