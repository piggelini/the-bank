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
    console.log(account);
    await accountCollection.insertOne(account);
    res.json({
        success: true,
        account
    });
})

app.delete('/api/accounts/:id', async (req, res) => {
    await accountCollection.deleteOne({ _id: ObjectId(req.params.id) });
    res.status(204).send();
});

app.put('/api/accounts/:id', async (req, res) => {
    let account = await accountCollection.findOne({ _id: ObjectId(req.params.id) });
    account = {
        ...account,
        ...req.body,
    };
    await accountCollection.updateOne({ _id: ObjectId(req.params.id) }, { $set: account });
    res.json({
        success: true,
        entry
    });
});







app.listen(port, () => console.log(`Listening on ${port}`));