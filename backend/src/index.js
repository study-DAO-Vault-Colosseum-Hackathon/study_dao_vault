const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
	res.send('Backend is running!');
});

// Example /api/resources route
app.get('/api/resources', (req, res) => {
	res.json({ message: 'Resources endpoint working!' });
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
