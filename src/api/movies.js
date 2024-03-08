const logger = require("../config/logger");
const {
  validateMovie,
  validateToken,
  validateAdmin,
} = require("../middlewares/validationMiddleware");

module.exports = (app, repository) => {
  app.get("/movies/premieres", validateToken, async (req, res, next) => {
    console.log("movies/premieres");
    const movies = await repository.getMoviesPremieres();
    res.status(200).json(movies);
  });

  app.get("/movies/:id", validateToken, async (req, res, next) => {
    const movie = await repository.getMovieById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");

    res.status(200).json(movie);
  });

  app.get("/movies", validateToken, async (req, res, next) => {
    const movies = await repository.getAllMovies();
    res.status(200).json(movies);
  });

  app.post(
    "/movies/",
    validateToken,
    validateAdmin,
    validateMovie,
    async (req, res, next) => {
      const movie = {
        titulo: req.body.titulo,
        sinopse: req.body.sinopse,
        duracao: parseInt(req.body.duracao),
        dataLancamento: new Date(req.body.dataLancamento),
        imagem: req.body.imagem,
        categorias: req.body.categorias,
      };

      const ret = await repository.addMovie(movie);
      logger.info(
        `User ${res.locals.userId} added movie: ${ret._id} at ${new Date()}`
      );
      res.status(201).json(ret);
    }
  );

  app.delete(
    "/movies/:id",
    validateToken,
    validateAdmin,
    async (req, res, next) => {
      const ret = await repository.deleteMovie(req.params.id);

      if (ret.deletedCount === 0)
        return res.status(404).send("Movie not found");

      logger.info(
        `User ${res.locals.userId} delete movie: ${req.params.id} at ${new Date()}`
      );
      res.status(204).send();
    }
  );
};
