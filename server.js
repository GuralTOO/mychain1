const express = require("express");
const cors = require("cors");
const app = express();

const {
  contract,
  updateDatabaseOnUserUpdated,
  web3,
  updateUser,
  addReview,
} = require("./contract");
const db = require("./database");

app.use(cors());
app.use(express.json());

//start the server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

//propogate changes from the blockchain to the database
updateDatabaseOnUserUpdated();

//receive a request to create a new review
app.post("/api/addReview", async (req, res) => {
  // Add review to blockchain contract
  const { userId, wallet } = req.body;
  const fromAddress = "0x..."; // Replace with the address that will send the transaction
  const privateKey = "0x..."; // Replace with the private key of the fromAddress

  const result = await addReview(userId, wallet, fromAddress, privateKey);

  if (result.success) {
    res
      .status(200)
      .json({ success: true, transactionHash: result.transactionHash });
  } else {
    res.status(500).json({ success: false, error: "Error calling updateUser" });
  }
});

//receive a request to get all reviews for a professor

app.get("/api/getProfessors/:id", async (req, res) => {
  const id = req.params.id;
  // Get Professors from the SQLite database
  try {
    const professors = await db.getProfessors(id);
    res.status(200).json(professors);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Error getting professors" });
  }
});

app.get("/api/getUniversities", async (req, res) => {
  // Get universities from the SQLite database
  try {
    const universities = await db.getUniversities();
    res.status(200).json(universities);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, error: "Error getting universities" });
  }
});

app.get("/api/getReviews/:id", async (req, res) => {
  const id = req.params.id;
  // Get reviews from the blockchain or the SQLite database (TBD which one)
  try {
    const reviews = await db.getReviews(id);
    res.status(200).json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Error getting reviews" });
  }
});
