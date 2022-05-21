import express from 'express';
import session from 'express-session';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const port = 3000;
const app = express();

app.use(express.static('public'));
app.use(express.json());
const saltRounds = 10;

app.set('views', './views');
app.set('view engine', 'ejs');

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('bank');
const accountCollection = db.collection('accounts');
const userCollection = db.collection('users');


app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret',
    cookie: {
        maxAge: 5 * 60 * 1000 // 5 minutes
    }
}));


const restrict = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
}

app.get("/", async (req, res) => {

});

app.get("/api/accounts", restrict, async (req, res) => {
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
        account
    });
});

//------------------USERS--------------------------


app.get("/api/users", async (req, res) => {
    let users = await userCollection.find({}).toArray();
    res.json(users);
})

app.get("/api/user/:id", async (req, res) => {
    const user = await userCollection.findOne({ _id: ObjectId(req.params.id) });
    res.json(user);
})



app.post('/api/users/login', async (req, res) => {
    const user = await userCollection.findOne({ user: req.body.user });
    const passMatches = await bcrypt.compare(req.body.pass, user.pass);
    console.log(user);
    if (user && passMatches) {
        req.session.user = user.user;

        res.json({
            user: user.user
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});



app.post("/api/users/register", async (req, res) => {
    const hash = await bcrypt.hash(req.body.pass, saltRounds);
    await userCollection.insertOne({
        user: req.body.user,
        pass: hash
    });

    res.json({
        success: true,
        user: req.body.user
    });
});

app.get('/api/users/loggedin', (req, res) => {
    if (req.session.user) {
        res.json({
            user: req.session.user
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.listen(port, () => console.log(`Listening on ${port}`));