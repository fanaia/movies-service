const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const repository = require("./repository");
const database = require("../config/database");

let testMovieId = null;

beforeAll(async () => {
  const movies = await repository.getAllMovies();
  testMovieId = movies[0]._id;
});

afterAll(async () => {
  database.disconnect();
});

test("getAllMovies", async () => {
  const movies = await repository.getAllMovies();

  expect(Array.isArray(movies)).toBeTruthy();
  expect(movies.length).toBeTruthy();
});

test("getMovieById", async () => {
  const movie = await repository.getMovieById(testMovieId);

  expect(movie).toBeTruthy();
  expect(movie._id).toEqual(testMovieId);
});

test("getMoviesPremieres", async () => {
  const movies = await repository.getMoviesPremieres();
  const dataLancamentos = new Date().setMonth(-1);
  let countMovies = 0;

  movies.forEach((movie) => {
    if (movie.dataLancamento >= dataLancamentos) countMovies++;
  });

  expect(Array.isArray(movies)).toBeTruthy();
  expect(movies.length).toEqual(countMovies);
});

test("addMovie", async () => {
  const movie = {
    titulo: "Filme Teste",
    sinopse: "Sinopse do filme teste",
    duracao: 120,
    dataLancamento: new Date(),
    imagem: "imagem.jpg",
    categorias: ["Ação"],
  };

  let ret;
  try {
    ret = await repository.addMovie(movie);
    expect(ret).toBeTruthy();
  } finally {
    if (ret) {
      const retDelete = await repository.deleteMovie(ret._id);
      expect(retDelete.deletedCount).toEqual(1);
    }
  }
});
