import express from 'express';
import session from 'express-session';
import { MongoClient, ObjectId } from 'mongodb';
const port = 3000;
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'ejs');

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('bank');
const accountCollection = db.collection('accounts');

app.get("/", async (req, res) => {


})

app.get("/api/accounts", async (req, res) => {
    let accounts = await accountCollection.find({}).toArray();
    res.json(accounts);
})

app.post("/api/accounts", async (req, res) => {
    const account = {
        ...req.body,
    };
    await accountCollection.insertOne(account);
    res.json({
        success: true,
        account
    });
})



app.listen(port, () => console.log(`Listening on ${port}`));