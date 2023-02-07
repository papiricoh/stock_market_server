const Manager = require("../models/manager.model.js");

// Create and Save a new Manager
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Manager
    const manager = new Manager({
        label: req.body.label,
        name: req.body.name,
        num_of_shares: req.body.num_of_shares,
        price: req.body.price,
        type: req.body.type
    });

    // Save Manager in the database
    Manager.create(manager, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Manager."
            });
        else res.send(data);
    });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

};

// Find a single Manager with a id
exports.findOne = (req, res) => {

};

// find all published Tutorials
exports.findAllPublished = (req, res) => {

};

// Update a Manager identified by the id in the request
exports.update = (req, res) => {

};

// Delete a Manager with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};