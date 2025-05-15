import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT ?? 6789;

const client = new MongoClient(process.env.MONGODB_URI);
// await client.connect();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('../public'));

// Provide contacts through the API
app.get('/api/contacts', async (req, res) => {
    const collection = client.db('pwa_demo').collection('contacts')
    const contacts = await collection.find({}).toArray();
    res.json(contacts);
});

app.post('/api/contacts', async (req, res) => {
    const newContact = req.body;
    const collection = client.db('pwa_demo').collection('contacts')
    const result = await collection.insertOne(newContact);
    res.status(201).json(result);
});

app.get('/api/travel', async (req, res) => {
    const travelCollection = client.db('pwa_demo').collection('travel');
    const travelEntries = await travelCollection.find({}).toArray();
    res.json(travelEntries);
})

app.post('/api/travel', async (req, res) => {
    const newText = req.body;
    const travelCollection = client.db('pwa_demo').collection('travel');
    const result = await travelCollection.insertOne(newText);
    res.status(201).json(result);
});

app.delete('/api/travel/:id', async (req, res) => {
    try {
    const id = req.params.id;

    const travelCollection = client.db('pwa_demo').collection('travel');
    const result = await travelCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({deletedCount: result.deletedCount})
    } catch (e){
        console.error("DELETE ERROR:", e);
        res.status(500).json({error: "Something went wrong", errorMessage: e.message})
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


