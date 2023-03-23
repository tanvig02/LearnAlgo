// imports
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: "../config.env" });

const PORT = process.env.PORT || 5000;

// middlewares
mongoose.set("strictQuery", true);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// db connect
const connectionURL =
  "mongodb+srv://tanvigaikwad:Tanvigaikwad02@cluster0.gueimbb.mongodb.net/bankingDB?retryWrites=true&w=majority";

mongoose
  .connect(connectionURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log(err);
  });

const Customer = require("./CustomerSchema");
const Transaction = require("./TransferSchema");

// apis

// cutomer collection connection
app.get("/customersdata", async (req, res) => {
  try {
    const data = await Customer.find({});
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

app.get("/customer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Customer.findById(id);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/transaction/new", async (req, res) => {
  const { from, to, amount } = req.body;
  try {
    const fromCust = await Customer.findById(from);
    const toCust = await Customer.findById(to);
    if (fromCust.balance < amount)
      return res.status(400).send("Amount greater than balance");
    fromCust.balance -= amount;
    toCust.balance += amount;
    await fromCust.save();
    await toCust.save();
    const newData = await Transaction.create({
      from,
      to,
      amount,
    });
    newData = await newData.populate("from to");
    res.status(200).json(newData);
  } catch (e) {
    console.log(e.message);
  }
});

// transfer collection connection

app.get("/transferdata", async (req, res) => {
  try {
    const data2 = await Transaction.find({}).populate("from to");
    res.status(200).json(data2);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

app.post("/addUser", async (req, res) => {
  const { name, email, balance } = req.body;

  if (!name || !email || !balance) {
    return res.status(422).json({ error: "please fill all the details" });
  }

  try {
    //find if the email already exist or not
    const userExist = await Customer.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else {
      const newUser = new Customer({ name, email, balance });
      await newUser.save().then((Customer) => res.json(Customer));
      res.status(201).json({ message: "user registed successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// app.get("/", (req, res) => {
//   res.status(200).send("hello world");
// });

//static files
app.use(express.static(path.join(__dirname, "../my-project/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-project/build/index.html"));
});
// app.use(require("../"))
console.log(path.join(__dirname, "../my-project/build/index.html"));

// listening
app.listen(PORT, () => {
  console.log(`listing to PORT ${PORT} `);
});
