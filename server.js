const express = require("express");
const cors = require("cors");
const sql = require("./app/models/db");

const app = express();
var corsOptions = {
    origin: "http://localhost:8081"
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

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
            result.json(err);
            return;
        } else {
            if (Number(data.num_of_free_shares) + Number(data.num_of_bought_shares) + Number(data.num_of_owner_shares) != data.num_shares) {
                let random = getRandomInt(data.num_shares);
                data.num_of_free_shares = random;
                data.num_of_bought_shares = data.num_shares - random;
                data.num_of_owner_shares = 0;
            }
            sql.query("INSERT INTO stock_market_shares_value (id_company, num_of_free_shares, num_of_bought_shares, num_of_owner_shares, share_price) VALUES ((SELECT id FROM stock_market_companies WHERE label_id = '" + data.label_id + "' ), '" + data.num_of_free_shares + "', '" + data.num_of_bought_shares + "', " + data.num_of_owner_shares + ", '" + data.share_price + "')", (err2, res2) => {
                if (err2) {
                    result.json(err2);
                    return;
                } else {
                    result.json({ result: "Company insert success - " + data.label });
                }

            });
        }
    });
});

app.get("/companies", (req, result) => { //ALL COMPANIES
    sql.query("SELECT * FROM stock_market_companies", (err, res) => {
        if (err) {
            result.json(err);
            return;
        } else {
            result.json({ result: res });
        }
    });
});

app.get("/companies/:id", (req, result) => { //COMPANY BY LABEL
    sql.query("SELECT * FROM stock_market_companies WHERE id = '" + req.params.id + "'", (err, res) => {
        if (err) {
            result.json(err);
            return;
        } else {
            sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE id = '" + req.params.id + "') ORDER BY price_change_date DESC LIMIT 1", (err2, res2) => {
                if (err2) {
                    result.json(err);
                    return;
                } else {
                    if (res2[0] != null) {
                        res[0].price = res2[0].share_price;
                        res[0].shares = { num_of_free_shares: res2[0].num_of_free_shares, num_of_bought_shares: res2[0].num_of_bought_shares, num_of_owner_shares: res2[0].num_of_owner_shares };
                    }
                    result.json({ result: res });
                }
            });
        }
    });
});

app.get("/companies/label/:label", (req, result) => { //COMPANY BY LABEL
    sql.query("SELECT * FROM stock_market_companies WHERE label_id = '" + req.params.label + "'", (err, res) => {
        if (err) {
            result.json(err);
            return;
        } else {
            sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE label_id = '" + req.params.label + "') ORDER BY price_change_date DESC LIMIT 1", (err2, res2) => {
                if (err2) {
                    result.json(err);
                    return;
                } else {
                    if (res2[0] != null) {
                        res[0].price = res2[0].share_price;
                        res[0].shares = { num_of_free_shares: res2[0].num_of_free_shares, num_of_bought_shares: res2[0].num_of_bought_shares, num_of_owner_shares: res2[0].num_of_owner_shares };
                    }
                    result.json({ result: res });
                }
            });
        }
    });
});
app.get("/companies/index", (req, result) => { //COMPANY BY LABEL
    let t = 'Index';
    sql.query("SELECT * FROM stock_market_companies WHERE type_of_company = '" + t + "'", (err, res) => {
        if (err) {
            result.json(err);
            return;
        } else {
            sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE type_of_company = '" + t + "') ORDER BY price_change_date DESC LIMIT 1", (err2, res2) => {
                if (err) {
                    result.json(err);
                    return;
                } else {
                    res[0].price = res2[0];
                    result.json({ result: res });
                }
            });
        }
    });
});

app.get("/test", async (req, result) => {

});

app.post("/companies/label/:label/movement/sell", async (req, result) => {
    let data = req.body; //shares_to_sell, user_id
    let user_wallet = await getUserWallet(data.user_id);
    let company = await getCompanyByLabel(req.params.label);
    company = company[0];
    let last_transaction = await getLastTransaction(company.id);
    let user_money = await getUserMoney(data.user_id);
    last_transaction = last_transaction[0];
    user_money = user_money[0];
    let wallet_company_index = await searchCompanyInWallet(user_wallet, company.id);
    if (company != null) {
        if (wallet_company_index != -1) {
            if (user_wallet[wallet_company_index].num_of_shares >= data.shares_to_sell) {
                await sellWalletShares(user_wallet[wallet_company_index], data.shares_to_sell);
                await addSellTransaction(last_transaction, data.shares_to_sell);
                await changeMoney(user_money, true, (last_transaction.share_price * data.shares_to_sell));
                result.json({ result: { done: true } });
            } else {
                result.json({ result: { done: false, reason: "Not enough Shares of company " + req.params.label } });
            }
        } else {
            result.json({ result: { done: false, reason: "Not having Shares of company " + req.params.label } });
        }
    } else {
        result.json({ result: { done: false, reason: "Company not exist" } });
    }
});

async function sellWalletShares(wallet, shares_to_sell) {
    let res = [];
    await sql.promise().query("UPDATE stock_market_shares_wallet SET num_of_shares = num_of_shares - " + shares_to_sell + " WHERE id = " + wallet.id).then(([rows, fields]) => {
        res = rows;
    });
    return res;
}

async function getCompanyByLabel(label) {
    let res = [];
    await sql.promise().query("SELECT * FROM stock_market_companies WHERE label_id = '" + label + "'").then(([rows, fields]) => {
        res = rows;
    });
    return res;
}

app.post("/companies/label/:label/movement/buy", (req, result) => {
    let data = req.body; //shares_to_buy, user_id
    let id = 0;
    if (data.shares_to_buy <= 0) {
        result.json({ result: { done: false } });
    } else {
        sql.query("SELECT * FROM stock_market_companies WHERE label_id = '" + req.params.label + "'", async (find_company_err, find_company_res) => {
            if (find_company_err) {
                result.json(find_company_err);
                return;
            } else {
                if (find_company_res[0] == null) {
                    result.json({ result: { done: false, reason: "Company with label: " + req.params.label + " not exists" } })
                } else {
                    id = find_company_res[0].id;
                    let last_transaction = await getLastTransaction(id);
                    last_transaction = last_transaction[0];
                    let user_money = await getUserMoney(data.user_id);
                    user_money = user_money[0];
                    let user_wallet = await getUserWallet(data.user_id);
                    if (user_money != null) {
                        if (user_money.money_balance >= (last_transaction.share_price * data.shares_to_buy)) {
                            if (last_transaction.num_of_free_shares >= data.shares_to_buy) {
                                await changeMoney(user_money, false, (last_transaction.share_price * data.shares_to_buy));
                                await updateWallet(user_money.id, data.shares_to_buy, user_wallet, req.params.label, id);
                                await addBuyTransaction(last_transaction, data.shares_to_buy);
                                result.json({ result: { done: true } });
                            } else {
                                result.json({ result: { done: false, reason: "No Shares" } });
                            }
                        } else {
                            result.json({ result: { done: false, reason: "No money" } });
                        }
                    } else {
                        result.json({ result: { done: false, reason: "User Not Exists" } });
                    }
                }
            }
        });
    }
});
async function addSellTransaction(last_transaction, shares_to_sell) {
    let total_shares = last_transaction.num_of_free_shares + last_transaction.num_of_bought_shares + last_transaction.num_of_owner_shares;
    let new_share_price = Number(Number(last_transaction.share_price) - Number(last_transaction.share_price * (shares_to_sell / total_shares))).toFixed(2);
    let res = [];
    await sql.promise().query("INSERT INTO stock_market_shares_value (id_company, num_of_free_shares, num_of_bought_shares, num_of_owner_shares, share_price) VALUES (" + last_transaction.id_company + ", " + Number(Number(last_transaction.num_of_free_shares) + Number(shares_to_sell)) + ", " + Number(Number(last_transaction.num_of_bought_shares) - Number(shares_to_sell)) + ", " + last_transaction.num_of_owner_shares + ", " + new_share_price + ")").then(([rows, fields]) => {
        res = rows;
    });
    return res;
}

async function addBuyTransaction(last_transaction, shares_to_buy) {
    let total_shares = last_transaction.num_of_free_shares + last_transaction.num_of_bought_shares + last_transaction.num_of_owner_shares;
    let new_share_price = Number(Number(last_transaction.share_price) + Number(last_transaction.share_price * (shares_to_buy / total_shares))).toFixed(2);
    let res = [];
    await sql.promise().query("INSERT INTO stock_market_shares_value (id_company, num_of_free_shares, num_of_bought_shares, num_of_owner_shares, share_price) VALUES (" + last_transaction.id_company + ", " + Number(Number(last_transaction.num_of_free_shares) - Number(shares_to_buy)) + ", " + Number(Number(last_transaction.num_of_bought_shares) + Number(shares_to_buy)) + ", " + last_transaction.num_of_owner_shares + ", " + new_share_price + ")").then(([rows, fields]) => {
        res = rows;
    });
    return res;
}

async function changeMoney(user_money, toAdd, money_to_move) {
    let res = [];
    if (toAdd) {
        await sql.promise().query("UPDATE stock_market_users SET money_balance = " + Number(Number(user_money.money_balance) + Number(money_to_move)) + " WHERE id = " + user_money.id).then(([rows, fields]) => {
            res = rows;
        });
    } else {
        await sql.promise().query("UPDATE stock_market_users SET money_balance = " + Number(Number(user_money.money_balance) - Number(money_to_move)) + " WHERE id = " + user_money.id).then(([rows, fields]) => {
            res = rows;
        });
    }
    return res;
}

async function searchCompanyInWallet(user_wallet, company_id) {
    let res_index = -1;
    for (let index = 0; index < user_wallet.length; index++) {
        if (user_wallet[index].id_company == company_id) {
            res_index = index;
        }
    }
    return res_index;
}

async function updateWallet(user_id, shares_to_buy, user_wallet, company_label, company_id) {
    let company_index = await searchCompanyInWallet(user_wallet, company_id);
    let res = [];
    if (company_index == -1) {//new row
        await sql.promise().query("INSERT INTO stock_market_shares_wallet (id_user, id_company, num_of_shares) VALUES ( " + user_id + ", (SELECT id FROM stock_market_companies WHERE label_id = '" + company_label + "'), " + shares_to_buy + ");").then(([rows, fields]) => {
            res = rows;
        });
    } else { //Update
        await sql.promise().query("UPDATE stock_market_shares_wallet SET num_of_shares = " + Number(Number(user_wallet[company_index].num_of_shares) + Number(shares_to_buy)) + " WHERE id = " + user_wallet[company_index].id + ";").then(([rows, fields]) => {
            res = rows;
        });
    }
    return res;
}

async function getUserMoney(user_id) {
    let res = [];
    await sql.promise().query("SELECT * FROM stock_market_users WHERE identifier = '" + user_id + "'").then(([rows, fields]) => {
        res = rows;
    });
    return res;
}

async function getUserWallet(user_id) {
    let res = [];
    await sql.promise().query("SELECT * FROM stock_market_shares_wallet WHERE id_user = (SELECT id FROM stock_market_users WHERE identifier = '" + user_id + "')").then(([rows, fields]) => {
        res = rows;
    });
    return res;
}

async function getLastTransaction(company_id) {
    let res = [];
    await sql.promise().query("SELECT * FROM stock_market_shares_value WHERE id_company = " + company_id + " ORDER BY price_change_date DESC LIMIT 1").then(([rows, fields]) => {
        res = rows;
    });
    return res;
}

app.get("/companies/label/:label/fullhistory", (req, result) => { //COMPANY FULL HISTORY
    sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE label_id = '" + req.params.label + "')", (err, res) => {
        if (err) {

            result.json(err);
            return;
        } else {
            result.json({ result: res });
        }
    });
});

app.get("/companies/label/:label/history", (req, result) => { //COMPANY HISTORY TO 40
    sql.query("SELECT * FROM stock_market_shares_value WHERE id_company = (SELECT id FROM stock_market_companies WHERE label_id = '" + req.params.label + "') ORDER BY price_change_date DESC LIMIT 40", (err, res) => {
        if (err) {
            result.json(err);
            return;
        } else {
            result.json({ result: res });
        }
    });
});

//require("./app/routes/manager.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});