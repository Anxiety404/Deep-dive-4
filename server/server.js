import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT ?? 6789;

// Connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
// await client.connect();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('../public'));

app.get('/api/travel', async (req, res) => {
    const travelCollection = client.db('pwa_demo').collection('travel');
    const travelEntries = await travelCollection.find({}).toArray();
    res.json(travelEntries);
})

app.post('/api/travel', async (req, res) => {
    const newText = req.body;
    const travelCollection = client.db('pwa_demo').collection('travel')
    const result = await collection.insert(newText);
    res.status(201).json(result);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


app.delete('/api/travel/:id', async (req, res) => {
  const { id } = req.params;
  const travelCollection = client.db('pwa_demo').collection('travel');
  const result = await travelCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
