const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const {
    MongoClient,
    ServerApiVersion,
    ObjectId
  } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tiivm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function run (){
    try{
        await client.connect();
        const noteCollection = client.db("notes").collection("note");
        console.log('connected');
        app.get('/notes',async(req, res)=>{
            const email = req.query;
            const coursor = noteCollection.find(email)
            const result = await coursor.toArray();
            res.send(result);
        });
        
        app.post('/notes',async(req, res)=>{
          const data = req.body.notesData;
          const result = await noteCollection.insertOne(data);
          res.send(result);
      });

      app.delete('/notes/:id',async(req, res)=>{
        const id = req.params.id;
        const filter = {
            _id: ObjectId(id)
          };
        const result = await noteCollection.deleteOne(filter);
        res.send(result);
    });
    }finally{

    }
}run().catch(console.dir);


app.get('/',(req,res)=>{
  res.send('Hi, I am your awesome server')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
