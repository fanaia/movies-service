const server = require("./server/server");
const movies = require("./api/movies");
const repository = require("./repository/repository");

(async () => {
  try {
    await server.start(movies, repository);
  } catch (error) {
    console.error(error);
  }
})();
 