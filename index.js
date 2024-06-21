const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

const transactionRoutes = require("./Routes/transactionRoute");

const app = express();

connectDB();
app.use(cors());
app.use(bodyParser.json());

//routes
app.get("/", (req, res) => {
  res.send("App runnig");
});

app.use("/api", transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App Listen at http://localhost:${PORT}`);
});
