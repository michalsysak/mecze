const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Połączenie z MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "mecze_info";
const collectionName = "mecze";

// Endpoint testowy
app.get('/', (req, res) => {
    res.send('Hello from our server!');
});

// Pobierz wszystkie mecze
app.get('/matches', async (req, res) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const matches = await collection.find({}).toArray();
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await client.close();
    }
});

// Dodaj nowy mecz
app.post('/matches', async (req, res) => {
    try {
        const match = req.body;
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await collection.insertOne(match);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await client.close();
    }
});

// Pobierz mecze danego kraju
app.get('/matches/:country', async (req, res) => {
    try {
        const country = req.params.country;
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const matches = await collection.find({
            $or: [
                { homeTeam: country },
                { awayTeam: country }
            ]
        }).toArray();
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await client.close();
    }
});

// Uruchomienie serwera
app.listen(8080, () => {
    console.log('server listening on port 8080');
});
