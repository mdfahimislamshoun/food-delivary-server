
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrclhpm.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
    const serviceCollection = client
      .db("service")
      .collection("services");

    const productCollection = client
      .db("procuctDB")
      .collection("procucts");

    const userCollection = client
      .db("userDB")
      .collection("users");

    const orderCollection = client
      .db("orderDB")
      .collection("orderCollection");


    app.get("/service",  async (req, res) => {
      const courser = serviceCollection.find();
      const result = await courser.toArray();
      res.send(result);
    });

    app.get("/product", async (req, res) => {
      const courser = productCollection.find();
      const result = await courser.toArray();
      res.send(result);
    });
    app.get("/order", async (req, res) => {
      const query = {};
      const email = req.query.email;
      if (email) {
        query.email = email
      }
      const courser = orderCollection.find(query);
      const result = await courser.toArray();
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const query = {};
      const email = req.query.email;
      if (email) {
        query.email = email
      }
      const courser = userCollection.find(query);
      const result = await courser.toArray();
      res.send(result);
    });


    app.post("/product", async (req, res) => {
      const newProcuct = req.body;
      console.log("new product :", newProcuct);
      const result = await productCollection.insertOne(newProcuct);
      res.send(result);
    });

    app.post("/order", async (req, res) => {
      const newOrder = req.body;
      console.log("new order :", newOrder);
      const result = await orderCollection.insertOne(newOrder);
      res.send(result);
    });


    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("new user :", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.patch('/order/:id', async (req, res) => {
      const status = req.body;
      console.log("update status ", status)
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedStatus = {
        $set: {
          status: status.status
        }
      }
      const result = await orderCollection.updateOne(filter, updatedStatus)
      res.send(result);
    })

    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    console.log("Database Connected!");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();
app.get("/", (req, res) => {
  res.status("project-blog-server-a11 running on port", port);
});

app.listen(port, () => {
  console.log("project-server running on ", port);
});