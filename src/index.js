const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

app.post('/users', (request, response) => {
  const { name, username, todos } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username)
  const id = uuidv4();

  if (userAlreadyExists) {
    return response.status(400).json({ error: "user already exists!" })
  }

  newUser = {
    name,
    username,
    id,
    todos: todos || []
  }

  users.push(newUser)

  return response.status(201).json(newUser);
});


function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username)

  if (!user) return response.status(404).json({ error: 'User not found' });

  request.user = user;

  return next();
}

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request

  newToto = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newToto);

  return response.status(201).json(newToto);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.query;
  const { user } = request

  let newTodo = user.todos.find((todo) => todo.id === id)

  if (!newTodo) {
    response.status(404).json({ error: "Task not found" });
  }

  const index = user.todos.indexOf(newTodo, 0);

  newTodo.title = title;
  newTodo.deadline = new Date(deadline);

  user.todos.splice(index, 1, newTodo)

  return response.status(204).json(newTodo);
});

app.patch('/todos/:id/done/', checksExistsUserAccount, (request, response) => {
  const { id } = request.query;
  const { user } = request

  let newTodo = user.todos.find((todo) => todo.id === id);

  if (!newTodo) {
    response.status(404).json({ error: "Task not found" });
  }

  const index = user.todos.indexOf(newTodo, 0);

  newTodo.done = true;

  user.todos.splice(index, 1, newTodo)

  return response.status(204).json({ success: "Task successfully changed" });

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.query;
  const { user } = request

  const todo = user.todos.find((todo) => todo.id === id)

  if (!todo) {
    response.status(404).json({ error: "Task not found" });
  }

  con
  const index = user.todos.indexOf(todo, 0)

  user.todos.splice(index, 1);

  return response.status(204).json({ success: "Task deleted successfully" });
});

app.listen(3333);
module.exports = app;