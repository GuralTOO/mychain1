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
const isHateSpeech = require("./ApiServices");

app.use(cors());
app.use(express.json());

//set-up google authentication
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

// verify user
const verifyUser = async (idToken, suffix) => {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    userEmail = payload.email;
    if (!userEmail.endsWith(suffix)) {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

//start the server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

//propogate changes from the blockchain to the database
updateDatabaseOnUserUpdated();

//receive a request to create a new review
app.post("/api/addReview", async (req, res) => {
  // Add review to blockchain contract
  const { userId, wallet, review, googleToken } = req.body;
  if (verifyUser(googleToken, "@bc.edu") == null) {
    res.status(500).json({ success: false, error: "Invalid Google Token" });
    return;
  }
  const fromAddress = "0x..."; // Replace with the address that will send the transaction
  const privateKey = "0x..."; // Replace with the private key of the fromAddress

  // Check if review is hate speech
  const isHate = await isHateSpeech(review);
  if (isHate == -1) {
    res
      .status(500)
      .json({ success: false, error: "Error calling isHateSpeech" });
    return;
  } else if (isHate) {
    res
      .status(500)
      .json({ success: false, error: "Review contains hate speech" });
    return;
  }
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
