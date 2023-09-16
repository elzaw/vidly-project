const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRent: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

function validateMovie(movie) {
  const schema = Joi.object(
    { title: Joi.string().min(5).max(50).required() },
    { genreId: Joi.objectId().required() },
    { numberInStock: Joi.number().min(0).required() },
    { dailyRent: Joi.number().min(0).required() }
  );

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
