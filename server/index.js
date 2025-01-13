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

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FIFA Matches API',
            version: '1.0.0',
            description: 'API do zarządzania tabelami meczów FIFA',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Endpoint testowy
app.get('/', (req, res) => {
    res.send('Hello from our server!');
});

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Pobierz wszystkie mecze
 *     description: Endpoint zwraca listę wszystkich meczów przechowywanych w bazie danych.
 *     responses:
 *       200:
 *         description: Lista wszystkich meczów
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID meczu w bazie danych
 *                     example: ObjectId('67854db23fa38944b5784817')
 *                   homeTeam:
 *                     type: string
 *                     description: Drużyna gospodarzy
 *                     example: Francja
 *                   awayTeam:
 *                     type: string
 *                     description: Drużyna gości
 *                     example: Portugalia
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Data meczu
 *                   homeScore:
 *                     type: integer
 *                     description: Wynik drużyny gospodarzy
 *                     example: 3
 *                   awayScore:
 *                     type: integer
 *                     description: Wynik drużyny gości
 *                     example: 2
 *       500:
 *         description: Błąd serwera
 */
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

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Dodaj nowy mecz
 *     description: Endpoint dodaje nowy mecz do bazy danych MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               homeTeam:
 *                 type: string
 *                 description: Nazwa drużyny gospodarzy
 *                 example: Poland
 *               awayTeam:
 *                 type: string
 *                 description: Nazwa drużyny gości
 *                 example: Germany
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data meczu
 *                 example: 2025-01-13
 *               homeScore:
 *                 type: integer
 *                 description: Wynik drużyny gospodarzy
 *                 example: 1
 *               awayScore:
 *                 type: integer
 *                 description: Wynik drużyny gości
 *                 example: 0
 *     responses:
 *       201:
 *         description: Mecz został dodany pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   description: Potwierdzenie operacji
 *                   example: true
 *                 insertedId:
 *                   type: string
 *                   description: ID dodanego meczu
 *                   example: "64c9e7fa2f1b2a3d5c7f8e9a"
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
// Dodaj mecz
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

/**
 * @swagger
 * /matches/{country}:
 *   get:
 *     summary: Pobierz mecze danego kraju
 *     description: Endpoint zwraca wszystkie mecze, w których drużyna podanego kraju była gospodarzem lub gościem.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         description: Nazwa kraju (np. Poland, Germany)
 *         schema:
 *           type: string
 *           example: Poland
 *     responses:
 *       200:
 *         description: Lista meczów związanych z podanym krajem
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID meczu w bazie danych
 *                     example: "64c9e7fa2f1b2a3d5c7f8e9a"
 *                   homeTeam:
 *                     type: string
 *                     description: Drużyna gospodarzy
 *                     example: Poland
 *                   awayTeam:
 *                     type: string
 *                     description: Drużyna gości
 *                     example: Germany
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Data meczu
 *                     example: 2025-01-13
 *                   homeScore:
 *                     type: integer
 *                     description: Wynik drużyny gospodarzy
 *                     example: 2
 *                   awayScore:
 *                     type: integer
 *                     description: Wynik drużyny gości
 *                     example: 1
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
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

/**
 * @swagger
 * /matches_del/{id}:
 *   delete:
 *     summary: Usuń mecz po ID
 *     description: Endpoint usuwa mecz z bazy danych na podstawie jego unikalnego ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID meczu w bazie danych MongoDB
 *         schema:
 *           type: string
 *           example: "64c9e7fa2f1b2a3d5c7f8e9a"
 *     responses:
 *       200:
 *         description: Mecz został pomyślnie usunięty
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mecz został usunięty.
 *       400:
 *         description: Niepoprawny format ID
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Niepoprawny format ID.
 *       404:
 *         description: Mecz nie został znaleziony
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mecz nie został znaleziony.
 *       500:
 *         description: Wewnętrzny błąd serwera
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Błąd serwera
 */
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
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Usunięcie meczu
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            res.status(404).send('Mecz nie został znaleziony.');
            console.log('Mecz nie został znaleziony.');
        } else {
            res.status(200).send('Mecz został usunięty.');
            console.log('Mecz został usunięty.');
        }
    } catch (err) {
        console.error(`Błąd serwera: ${err.message}`);
        res.status(500).send(`Błąd serwera: ${err.message}`);
        console.log(`Błąd serwera: ${err.message}`);
    } finally {
        await client.close();
    }
});


// Uruchomienie serwera
app.listen(8080, () => {
    console.log('server listening on port 8080');
});
