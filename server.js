const express = require("express");
const cors = require("cors");
const app = express();

// Nate changes: there are different exports now
const {
  // updateDatabaseOnUserUpdated,
  addReview,
  getReviews
} = require("./contract");


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
// Nate changes: are we still doing this or no?
updateDatabaseOnUserUpdated();

//receive a request to create a new review
app.post("/api/addReview", async (req, res) => {
  // Add review to blockchain contract
  // Nate changes: should this line be this instead
  // const { profID, review, rating } = req.body;
  const { userId, wallet } = req.body;
  
  // Nate changes: Don't need either of these since there in contract.js
  const fromAddress = "0x..."; // Replace with the address that will send the transaction
  const privateKey = "0x..."; // Replace with the private key of the fromAddress

  // Nate changes: the addReview function takes different parameters
  // const result = await addReview(profID, review, rating);
  const result = await addReview(userId, wallet, fromAddress, privateKey);

  // Nate changes: purpose of this?? Were not dealing with the transaction hash
  if (result.success) {
    res
      .status(200)
      .json({ success: true, transactionHash: result.transactionHash });
  } else {
    res.status(500).json({ success: false, error: "Error calling updateUser" });
  }
});

// Nate changes: the front end just needs to send a profID for this function, idk what :id is doing
//receive a request to get all reviews for a professor
app.get("/api/getReviews/:id", async (req, res) => {
  const id = req.params.id;
  
  // Nate changes: we are no longer using the db to hold reviews/ratings
  // Get reviews from the SQLite database
  try {
    const reviews = await db.getReviews(id);
    res.status(200).json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Error getting reviews" });
  }
});
