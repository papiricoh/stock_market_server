const express = require("express");
const cors = require("cors");
const sql = require("./app/models/db");

const app = express();
var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome ." });
});
app.get("/test", (req, result) => {
    sql.query("INSERT INTO stock_market_companies (label_id, label, num_shares, price_per_share, type_of_company) VALUES ('NKKK', 'JUKla', 1200, 12223, 'Sprit')", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created manager: ", { label_id: res.label_id, label: res.label, num_shares: res.num_shares });
        result.json({ label_id: res.label_id, label: res.label, num_shares: res.num_shares });
    });
});

app.get("/companies/:id", (req, result) => {
    sql.query("SELECT * FROM stock_market_companies WHERE id = " + req.params.id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            console.log("created manager: ", { res });
            result.json({ company: res[0] });
        }
    });
});

app.get("/companies/label/:label", (req, result) => {
    sql.query("SELECT * FROM stock_market_companies WHERE label_id = '" + req.params.label + "'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            console.log("created manager: ", { res });
            result.json({ company: res[0] });
        }
    });
});

//require("./app/routes/manager.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});