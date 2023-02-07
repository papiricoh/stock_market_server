module.exports = app => {
    const manager = require("../controllers/manager.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", manager.create);

    // Retrieve all Tutorials
    router.get("/", manager.findAll);

    // Retrieve all published Tutorials
    router.get("/published", manager.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", manager.findOne);

    // Update a Tutorial with id
    router.put("/:id", manager.update);

    // Delete a Tutorial with id
    router.delete("/:id", manager.delete);

    // Delete all Tutorials
    router.delete("/", manager.deleteAll);

    app.use('/api/manager', router);
};