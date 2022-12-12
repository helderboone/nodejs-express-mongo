const db = require("../models");
const Car = db.Cars;

exports.create = (req, res) => {  
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const Car = new Car({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  Car.save(Car)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Car."
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Car.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Cars."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Car.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Car with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Car with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Car.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Car with id=${id}. Maybe Car was not found!`
        });
      } else res.send({ message: "Car was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Car with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Car.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Car with id=${id}. Maybe Car was not found!`
        });
      } else {
        res.send({
          message: "Car was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Car with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Car.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Cars were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Cars."
      });
    });
};

exports.findAllPublished = (req, res) => {
  Car.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Cars."
      });
    });
};