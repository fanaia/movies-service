const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const schema = require("../schemas/movieSchema");

const ADMIN_PROFILE_ID = 1;

const validateMovie = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).send(error.details.map((d) => d.message));
  }
  next();
};

const validateToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  token = token.replace("Bearer ", "");

  try {
    const { userId, profileId } = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.userId = userId;
    res.locals.profileId = profileId;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const validateAdmin = (req, res, next) => {
  const { profileId } = res.locals;

  if (profileId == ADMIN_PROFILE_ID) {
    next();
  } else {
    logger.info(
      `User ${res.locals.userId} tentou um acessar a rota 
      ${req.path} as ${new Date()} e teve o acesso negado.`
    );
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = { validateMovie, validateToken, validateAdmin };
