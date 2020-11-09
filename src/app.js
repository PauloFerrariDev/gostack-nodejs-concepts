const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const logRequest = (request, response, next) => {
  const { method, url } = request;

  const logLabel = `[${method}] ${url}`;

  console.time(logLabel);

  next(); // Next Middleware

  console.timeEnd(logLabel);
};

app.use(logRequest);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: "Repository not found." });
  }

  let repository = repositories[repoIndex];

  repository = {
    ...repository,
    title,
    url,
    techs,
  };

  repositories[repoIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: "Repository not found." });
  }

  let repository = repositories[repoIndex];

  repository = {
    ...repository,
    likes: repository.likes + 1,
  };

  repositories[repoIndex] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
