const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

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

// Usuń mecz po ID
app.delete('/matches_del/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Sprawdź format ID
        if (!ObjectId.isValid(id)) {
            console.error(`Niepoprawny format ID: ${id}`);
            return res.status(400).send('Niepoprawny format ID.');
        }

        await client.connect();
        console.log('Połączono z bazą danych.');
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Usunięcie meczu
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            res.status(404).send('Mecz nie został znaleziony.');
        } else {
            res.status(200).send('Mecz został usunięty.');
        }
    } catch (err) {
        console.error(`Błąd serwera: ${err.message}`);
        res.status(500).send(`Błąd serwera: ${err.message}`);
    } finally {
        await client.close();
    }
});


// Uruchomienie serwera
app.listen(8080, () => {
    console.log('server listening on port 8080');
});
