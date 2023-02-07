const sql = require("./db.js");

// constructor
const Manager = function (manager) {
    this.label_id = manager.label;
    this.label = manager.name;
    this.num_shares = manager.num_of_shares;
    this.price_per_share = manager.price;
    this.type_of_company = manager.type;
};

Manager.create = (newManager, result) => {
    sql.query("INSERT INTO stock_market_companies SET ?", newManager, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created manager: ", { id: res.insertId, ...newManager });
        result(null, { id: res.insertId, ...newManager });
    });
};

Manager.findById = (id, result) => {
    sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found manager: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Manager with the id
        result({ kind: "not_found" }, null);
    });
};

Manager.getAll = (title, result) => {
    let query = "SELECT * FROM tutorials";

    if (title) {
        query += ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tutorials: ", res);
        result(null, res);
    });
};

Manager.getAllPublished = result => {
    sql.query("SELECT * FROM tutorials WHERE published=true", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tutorials: ", res);
        result(null, res);
    });
};

Manager.updateById = (id, manager, result) => {
    sql.query(
        "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
        [manager.title, manager.description, manager.published, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Manager with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated manager: ", { id: id, ...manager });
            result(null, { id: id, ...manager });
        }
    );
};

Manager.remove = (id, result) => {
    sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Manager with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted manager with id: ", id);
        result(null, res);
    });
};

Manager.removeAll = result => {
    sql.query("DELETE FROM tutorials", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} tutorials`);
        result(null, res);
    });
};

module.exports = Manager;