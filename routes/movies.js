const { Movie, validate } = require("../models/movies");
const express = require("express");
const { Genre } = require("../models/genres");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  0;
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Genre not found");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRent: req.body.dailyRent,
  });
  await movie.save();
  res.send(movie);
});
module.exports = router;
