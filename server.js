const express = require("express")
const mongo  = require("mongodb").MongoClient

const app =express()

const url = "mongodb://localhost:27017"

let db, trips, expenses

mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err, client) => {
    if (err) {
        console.error(err)
        return
    } 
    db = client.db("mytripcost")
    trips = db.collection("trips")
    expenses = db.collection("expenses")
})

app.use(express.json())

//add a trip
app.post ("/trip", (req, res) => {
    const name = req.body.name
    trips.insertOne({ name: name}, (err, result) => {
        if (err) {
            console.error(err); res.status(500).json ({err: err})
            return
        }
        console.log(result); res.status(200).json({ok:true})
    })
})

//list the trips
app.get ("/trips", (req, res) => {
    trips.find().toArray((err, items) => {
        if (err){
            console.error(err)
            res.status(500).json({err:err})
        return    
    }
    res.status(200).json({trips: items })
    })
})

//add an expense or register an expense with five parametres
app.post ("/expense", (req, res) => {
    expenses.insertOne(
        {
        trip: req.body.trip,
        date: req.body.date,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
    },
    (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({err: err})
            return
        }
        res.status(200).json({
            ok: true})
    }
    )
})

//List all expenses which accepts the trip parameter with an id stored in the database
app.get ("/expenses", (req, res) => {
    expenses.find({trip: req.body.trip}).toArray((err, items) =>{
        if(err) {
            console.error(err)
            res.status(500).json({err: err})
            return
        }
        res.status(200).json({
            expenses: items})

        
    })
})





app.listen(3000, () => console.log ("Server is ready"))