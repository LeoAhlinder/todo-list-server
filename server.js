const express = require('express');
const app = express();
const mysql = require('mysql');
const http = require("http").createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Webbsidan')));

// Serve index.html
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'Webbsidan', 'index.html'));
});

// Connect to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "webbserver",
});

// Listen for incoming socket connections
io.on('connection', (socket) => {
  console.log('a user connected');

  // Fetch all tasks from the database and emit them to the client-side
  connection.query("SELECT * FROM todo_list", (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      socket.emit('initial tasks', results);
    }
  });

  // Listen for the 'add task' event
  socket.on('add task', (task) => {
    console.log(task);
    console.log('Task added: ' + task.title);
    const query = "INSERT INTO todo_list (id, title, link) VALUES (NULL, ?, ?)";
    connection.query(query, [task.title, task.link], function(err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log('Task added to database with ID: ' + result.insertId);
        task.id = result.insertId;
        io.emit('task added', task);
      }
    });
  });
});

// Start the server and listen on port 3000
http.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});

// Connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database: ' + error.stack);
    return;
  }
  console.log('Connected to MySQL database with connection id: ' + connection.threadId);
});
