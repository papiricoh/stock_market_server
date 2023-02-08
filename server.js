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
app.post("/companies/add", (req, result) => {
    let data = req.body;
    sql.query("INSERT INTO stock_market_companies (label_id, label, num_shares, type_of_company) VALUES ('" + data.label_id + "', '" + data.label + "', " + data.num_shares + ", '" + data.type + "')", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.json(err);
            return;
        } else {

        }

        result.json({ result: "Company insert success - " + data.label });
    });
});

app.get("/companies", (req, result) => { //ALL COMPANIES
    sql.query("SELECT * FROM stock_market_companies", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.json(err);
            return;
        } else {
            console.log("created manager: ", { res });
            result.json({ res });
        }
    });
});

app.get("/companies/:id", (req, result) => { //COMPANY BY LABEL
    sql.query("SELECT * FROM stock_market_companies WHERE id = '" + req.params.id + "'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.json(err);
            return;
        } else {
            sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE id = '" + req.params.id + "') ORDER BY price_change_date DESC LIMIT 1", (err2, res2) => {
                if (err2) {
                    console.log("error: ", err);
                    result.json(err);
                    return;
                } else {
                    if (res2[0] != null) {
                        res[0].price = res2[0].share_price;
                        res[0].shares = { num_of_free_shares: res2[0].num_of_free_shares, num_of_bought_shares: res2[0].num_of_bought_shares, num_of_owner_shares: res2[0].num_of_owner_shares };
                    }
                    console.log("returned company: ", { res });
                    result.json({ company: res });
                }
            });
        }
    });
});

app.get("/companies/label/:label", (req, result) => { //COMPANY BY LABEL
    sql.query("SELECT * FROM stock_market_companies WHERE label_id = '" + req.params.label + "'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.json(err);
            return;
        } else {
            sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE label_id = '" + req.params.label + "') ORDER BY price_change_date DESC LIMIT 1", (err2, res2) => {
                if (err2) {
                    console.log("error: ", err);
                    result.json(err);
                    return;
                } else {
                    if (res2[0] != null) {
                        res[0].price = res2[0].share_price;
                        res[0].shares = { num_of_free_shares: res2[0].num_of_free_shares, num_of_bought_shares: res2[0].num_of_bought_shares, num_of_owner_shares: res2[0].num_of_owner_shares };
                    }
                    console.log("returned company: ", { res });
                    result.json({ company: res });
                }
            });
        }
    });
});
app.get("/companies/index", (req, result) => { //COMPANY BY LABEL
    let t = 'Index';
    sql.query("SELECT * FROM stock_market_companies WHERE type_of_company = '" + t + "'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.json(err);
            return;
        } else {
            sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE type_of_company = '" + t + "') ORDER BY price_change_date DESC LIMIT 1", (err2, res2) => {
                if (err) {
                    console.log("error: ", err);
                    result.json(err);
                    return;
                } else {
                    res[0].price = res2[0];
                    console.log("returned company: ", { res });
                    result.json({ company: res });
                }
            });
        }
    });
});


app.get("/companies/label/:label/fullhistory", (req, result) => { //COMPANY FULL HISTORY
    sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE label_id = '" + req.params.label + "')", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.json(err);
            return;
        } else {
            console.log("created manager: ", { res });
            result.json({ res });
        }
    });
});

app.get("/companies/label/:label/history", (req, result) => { //COMPANY HISTORY TO 40
    sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE label_id = '" + req.params.label + "') ORDER BY price_change_date DESC LIMIT 40", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.json(err);
            return;
        } else {
            console.log("created manager: ", { res });
            result.json({ res });
        }
    });
});

//require("./app/routes/manager.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});