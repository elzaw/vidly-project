const { Rental, validate } = require("../models/rentals");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");
const fawn = require("fawn");
const router = express.Router();

// Fawn.init(mongoose);
Fawn.init("mongodb://127.0.0.1:27017/vidly");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0]);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: req.body.customerId,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: req.body.movieId,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});
module.exports = router;
