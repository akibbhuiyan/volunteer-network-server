const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.g0q0cnp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.send('Hello World!')
})

client.connect(err => {
    const activytyCollection = client.db("volunteer-network").collection("activities");
    const volunteerCollection = client.db("volunteer-network").collection("volunteer");

    console.log('database connected');

    app.post('/volunteer', (req, res) => {
        const newUser = req.body;
        console.log(newUser);
        volunteerCollection.insertOne(newUser)
            .then((result) => {
                res.send(result.acknowledged)
            })
    })
    app.post('/addevent', (req, res) => {
        const newUser = req.body;
        console.log(newUser);
        activytyCollection.insertOne(newUser)
            .then((result) => {
                res.send(result.acknowledged)
            })
    })
    app.get('/tasks', (req, res) => {
        const filter = req.query.search;
        activytyCollection.find({ title: { $regex: filter } })
            .toArray((err, document) => {
                res.send(document)
            })
    })
    app.get('/admintask', (req, res) => {
        const remove = req.query.delete;
        console.log(remove);
        volunteerCollection.deleteOne({ _id: remove })
            .then((result) => {
                res.send(result)
            })
    })
    app.get('/activities', (req, res) => {
        console.log();
        activytyCollection.find({}).toArray((err, document) => {
            res.send(document)
        })
    })
    app.get('/admintask', (req, res) => {
        volunteerCollection.find({}).toArray((err, document) => {
            res.send(document)
        })
    })
    app.get('/eventTask', (req, res) => {
        volunteerCollection.find({ email: req.query.email }).toArray((err, document) => {
            res.send(document)
        })
    })
});


app.listen(process.env.PORT || 5000)