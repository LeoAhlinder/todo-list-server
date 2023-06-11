// Connect to the server's socket.io instance
const socket = io();

// Listen for the 'chat message' event
socket.on('chat message', (msg) => {
  // Display the received message in the chat window
  const li = document.createElement('li');
  li.textContent = msg;
  document.getElementById('myUL').appendChild(li);
});

// Listen for the 'task added' event
socket.on('task added', (data) => {
  // Add the new task to the to-do list
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = data.link;
  a.textContent = data.title;
    
  li.appendChild(a);
  document.getElementById('myUL').appendChild(li);
});


// Listen for the 'initial tasks' event
socket.on('initial tasks', (tasks) => {
  // Add the tasks to the to-do list
  tasks.forEach((task) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = task.link;
    a.textContent = task.title;
    li.appendChild(a);
    
    document.getElementById('myUL').appendChild(li);
  });
});

function addTask() {
  // Get the values of the task title and link inputs
  const titleValue = document.getElementById("myInput").value;
  const linkValue = document.getElementById("myLink").value;

  if (titleValue === '') {
    alert("You must enter a task title!");
  } else {
    // Create a new task object and emit the 'add task' event to the server
    const task = { title: titleValue, link: linkValue, id: null }; 
    socket.emit('add task', task);
  }

  // Clear the input fields
  document.getElementById("myInput").value = "";
  document.getElementById("myLink").value = "";
}
