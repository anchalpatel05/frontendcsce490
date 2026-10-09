const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, "messages.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Read all messages from messages.json
function readMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

// Write the messages array back to messages.json
function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// Get all saved messages
app.get("/messages", (req, res) => {
  res.json(readMessages());
});

// Save a new message
app.post("/messages", (req, res) => {
  const text = (req.body.text || "").trim();

  if (!text) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  const messages = readMessages();
  const newMessage = {
    text: text,
    date: new Date().toLocaleString()
  };

  messages.push(newMessage);
  saveMessages(messages);

  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Text Collector running at http://localhost:${PORT}`);
});
