const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const db = require("./database");

const contractABI = []; // Replace with your smart contract ABI
const contractAddress = "0x..."; // Replace with your smart contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// We will 90% likely not need this function
const updateDatabaseOnReviewAdded = () => {
  contract.events
    .ReviewAdded()
    .on("data", (event) => {
      const userId = event.returnValues.userId;
      const wallet = event.returnValues.wallet;

      db.run(
        "UPDATE users SET wallet = ? WHERE id = ?", // Replace with a real SQL query
        [wallet, userId],
        (err) => {
          if (err) {
            console.error("Error propogating review to database:", err);
          } else {
            console.log(`Review for ${userId} added to database`);
          }
        }
      );
    })
    .on("error", (error) => {
      console.error("Error watching for Review Added event:", error);
    });
};

// This function will be called when a user adds a review
const addReview = async (userId, wallet, fromAddress, privateKey) => {
  try {
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const gasPrice = await web3.eth.getGasPrice();

    const txData = {
      from: fromAddress,
      to: contractAddress,
      nonce: nonce,
      gasPrice: gasPrice,
      data: contract.methods.addReview(userId, wallet).encodeABI(),
    };

    const gasLimit = await web3.eth.estimateGas(txData);
    txData.gas = gasLimit;

    const signedTx = await web3.eth.accounts.signTransaction(
      txData,
      privateKey
    );
    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    return { success: true, transactionHash: txReceipt.transactionHash };
  } catch (error) {
    console.error("Error calling addReview:", error);
    return { success: false, error: "Error calling addReview" };
  }
};

module.exports = {
  contract,
  updateDatabaseOnReviewAdded,
  web3,
  addReview,
};
