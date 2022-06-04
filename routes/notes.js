const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

// GET Route retrieving all notes
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route to submit notes
notes.post("/", (req, res) => {
  // Destructure
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error posting note");
  }
});

// DELETE Route for a note
notes.delete("/:id", (req, res) => {
  const id = req.params.id;

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes with exception of selected one
      const result = json.filter((note) => note.id !== id);

      // Save above array to the filesystem
      writeToFile("./db/db.json", result);

      res.json(`Note ${id} has been deleted `);
    });
});

module.exports = notes;
