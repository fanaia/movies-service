const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");

const server = require("../server/server");
const movies = require("./movies");
const repositoryMock = require("../repository/__mocks__/repository");

let app;

beforeAll(async () => {
  app = await server.start(movies, repositoryMock);
});

afterAll(async () => {
  await server.stop();
});

test("GET /movies 200", async () => {
  const res = await request(app).get("/movies/");
  expect(res.status).toEqual(200);
  expect(Array.isArray(res.body)).toBeTruthy();
  expect(Array.length).toBeTruthy();
});

test("GET /movies/:id 200", async () => {
  const id = "1";
  const res = await request(app).get(`/movies/${id}`);
  expect(res.status).toEqual(200);
  expect(res.body._id).toEqual(id);
});

test("GET /movies/:id 404 NOT FOUND", async () => {
  const id = "-1";
  const res = await request(app).get(`/movies/${id}`);
  expect(res.status).toEqual(404);
});

test("GET /movies/premieres 200", async () => {
  const res = await request(app).get("/movies/premieres");
  expect(res.status).toEqual(200);
  expect(Array.isArray(res.body)).toBeTruthy();
  expect(Array.length).toBeTruthy();
});

test("POST /movies/ 201", async () => {
  const movie = {
    titulo: "Filme Teste",
    sinopse: "Sinopse do filme teste",
    duracao: 120,
    dataLancamento: new Date(),
    imagem: "http://imagem.jpg",
    categorias: ["Ação"],
  };

  const res = await request(app)
    .post("/movies")
    .set("Content-Type", "application/json")
    .send(movie);

  expect(res.status).toEqual(201);
  expect(res.body).toBeTruthy();
});

test("POST /movies/ 422", async () => {
  const movie = {};

  const res = await request(app)
    .post("/movies")
    .set("Content-Type", "application/json")
    .send(movie);

  expect(res.status).toEqual(422);
  expect(res.body).toBeTruthy();
});

test("DELETE /movies/:id 204", async () => {
  const id = "1";
  const res = await request(app).delete(`/movies/${id}`);
  expect(res.status).toEqual(204);
});

test("DELETE /movies/:id 404", async () => {
  const id = "-1";
  const res = await request(app).delete(`/movies/${id}`);
  expect(res.status).toEqual(404);
});
