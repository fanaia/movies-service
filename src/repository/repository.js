const { ObjectId } = require("mongodb");
const database = require("../config/database");

const getAllMovies = async () => {
  const db = await database.connect();
  return db.collection("movies").find().toArray();
};

const getMovieById = async (id) => {
  const db = await database.connect();
  return db.collection("movies").findOne({ _id: new ObjectId(id) });
};

const getMoviesPremieres = async () => {
  const db = await database.connect();
  const dataAtual = new Date();
  const dataLancamentos = new Date(
    dataAtual.setMonth(dataAtual.getMonth() - 1)
  );

  return db
    .collection("movies")
    .find({ dataLancamento: { $gte: dataLancamentos } })
    .toArray();
};

const addMovie = async (movie) => {
  const db = await database.connect();
  const ret = await db.collection("movies").insertOne(movie);
  movie._id = ret.insertedId;
  return movie;
};

const deleteMovie = async (id) => {
  const db = await database.connect();
  return db.collection("movies").deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
  getAllMovies,
  getMovieById,
  getMoviesPremieres,
  addMovie,
  deleteMovie,
};
