/**
 * Small demo for blockchain minor 2023-2024
 * @author Pieter Leek
 */

// Smart contract address
const contractAddress = "0xBE7b686b4a763FdFbd9cc9510141d11709D42C98";

/**
 * Function to connect to the blockchain
 */
async function connectToBlockchain() {
    try {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            console.warn("Non-Ethereum browser detected. Consider using MetaMask!");
            // Connect to local provider
            window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
        }
    } catch (error) {
        console.error("Failed to connect to blockchain:", error);
        // Handle connection error
        displayError("Failed to connect to blockchain. Please check your network connection and try again.");
    }
}

/**
 * Function to retrieve user accounts
 */
async function getAccounts() {
    try {
        const accounts = await window.web3.eth.getAccounts();
        window.account = accounts[0];
        // Listen for account changes
        window.ethereum.on('accountsChanged', function (newAccounts) {
            window.account = newAccounts[0];
            // Update account-related UI elements if needed
        });
    } catch (error) {
        console.error("Failed to retrieve accounts:", error);
        displayError("Failed to retrieve accounts. Please make sure you are logged in to MetaMask or your Ethereum wallet.");
    }
}

/**
 * Function to connect to the smart contract
 */

async function connectToContract() {
    try {
        window.contract = new window.web3.eth.Contract(ABI, contractAddress);
    } catch (error) {
        console.error("Failed to connect to contract:", error);
        displayError("Failed to connect to the smart contract. Please try again later.");
    }
}

/**
 * Function to retrieve current balance of the contract
 */
async function retrieveCurrentBalance() {
    try {
        const balance = await window.web3.eth.getBalance(contractAddress);
        const ether = window.web3.utils.fromWei(balance, "ether");
        document.getElementById("amountEth").textContent = `You have ${ether} ETH in your contract`;
    } catch (error) {
        console.error("Failed to retrieve contract balance:", error);
        displayError("Failed to retrieve contract balance. Please try again later.");
    }
}

/**
 * Function to send a message to the contract
 *
 */
async function sendMessage() {
    try {
        const ethAddress = document.getElementById("EthAddress").value;
        const message = document.getElementById("SendMessage").value;
        if (!ethAddress || !message) return;

        await window.contract.methods.addMessage(ethAddress, message).send({ from: window.account });
        document.getElementById("SendMessage").value = '';
        await getTotalMessages();
        // Optionally, provide user feedback for successful message sending
    } catch (error) {
        console.error("Failed to send message:", error);
        displayError("Failed to send message. Please try again later.");
    }
}

/**
 * Function to add funds to the contract
 */
async function depositMoney() {
    try {
        const etherAmount = document.getElementById("sendMoney").value;
        if (!etherAmount) return;

        const weiValue = window.web3.utils.toWei(etherAmount, "ether");
        await window.contract.methods.makePayment().send({ from: window.account, value: weiValue });
        document.getElementById("sendMoney").value = '';
        await retrieveCurrentBalance();
        // Optionally, provide user feedback for successful deposit
    } catch (error) {
        console.error("Failed to deposit money:", error);
        displayError("Failed to deposit money into the contract. Please try again later.");
    }
}
/**
 *  Function to retrieve total messages from the contract
 **/
async function getTotalMessages() {
    try {
        const total = await window.contract.methods.getTotalMessages().call();
        updateMessageOptions(total);
    } catch (error) {
        console.error("Failed to retrieve total messages:", error);
        displayError("Failed to retrieve messages from the contract. Please try again later.");
    }
}

/**
 * Function to update message options in UI
 */
function updateMessageOptions(total) {
    const messageSelect = document.getElementById("getmessageID");
    messageSelect.innerHTML = '';
    if (total === 0) {
        messageSelect.disabled = true;
        const option = document.createElement("option");
        option.textContent = "No messages available";
        messageSelect.appendChild(option);
        return;
    }
    messageSelect.disabled = false;
    for (let i = 0; i < total; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i + 1;
        messageSelect.appendChild(option);
    }
}

/**
 * Function to retrieve a single message from the contract
 */
async function getOneMessage() {
    try {
        const messageSelect = document.getElementById("getmessageID");
        const id = messageSelect.value;
        const message = await window.contract.methods.getMessage(id).call({ from: window.account });
        document.getElementById("printMessageHere").textContent = message;
    } catch (error) {
        console.error("Failed to retrieve message:", error);
        displayError("Failed to retrieve the selected message. Please try again later.");
    }
}

/**
 * Utility function to display error messages on the UI
 */

function displayError(errorMessage) {
   alert(errorMessage);
}

/**
* Initialization function
 s*/
async function initialize() {
    try {
        await connectToBlockchain();
        await connectToContract();
        await getAccounts();
        await retrieveCurrentBalance();
        await getTotalMessages();

        // Event listeners for UI buttons
        document.getElementById("btnSendMessage").addEventListener("click", sendMessage);
        document.getElementById("btnAddMoney").addEventListener("click", depositMoney);
        document.getElementById("btnGetMessage").addEventListener("click", getOneMessage);
    } catch (error) {
        console.error("Initialization error:", error);
        displayError("Initialization failed. Please refresh the page and try again.");
    }
}

// Call initialization function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", initialize);