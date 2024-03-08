const Joi = require("joi");

const schema = Joi.object({
  titulo: Joi.string().required().min(2).max(150),
  sinopse: Joi.string().min(10).max(500),
  duracao: Joi.number().integer().required().min(1),
  dataLancamento: Joi.date().required(),
  imagem: Joi.string().uri(),
  categorias: Joi.array().items(Joi.string()).required(),
}).options({ abortEarly: false });

module.exports = schema;
