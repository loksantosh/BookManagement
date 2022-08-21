const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route.js");
const app = express();
const Port = process.env.PORT || 3000;

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://dhirajpatil:XuEAzywgRheQB7B1@cluster0.0v32f.mongodb.net/group24Database?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);
app.listen(Port, function () {
  console.log("express app running on PORT " + Port);
});
