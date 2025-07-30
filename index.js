// index.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection details
const mongoUrl = "mongodb://admin:1qazZAQ!@56.228.66.193:27017?authSource=admin/";
const dbName = "local";
const collectionName = "bdy";

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint to receive chat messages
app.post('/save-message', async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid message input' });
    }

    try {
        const client = new MongoClient(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne({
            message,
            timestamp: new Date()
        });

        await client.close();

        return res.json({ success: true, insertedId: result.insertedId });
    } catch (err) {
        console.error('MongoDB error:', err);
        return res.status(500).json({ error: 'Failed to save message' });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('👋 Chat Message API is running');
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});
