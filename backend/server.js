const express = require('express');  
const app = express();               
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.post('/data', (req, res) => {
    console.log(req.body);  
    res.send({ message: 'Data received!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
