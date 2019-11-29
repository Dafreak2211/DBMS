const chalk = require("chalk");
const axios = require("axios");
const pdf = require("../route/pdf/index");

const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);
const connection = mysql.createConnection(config);

module.exports = {
  getProduct: (req, res) => {
    let sql = `Select * from product`;
    console.log(chalk.blue(sql));
    connection.query(sql, (error, results, fields) => {
      res.send(results);
    });
  },
  getByGroupProduct: (req, res) => {
    let sql = `call getByGroupProduct('${req.body.key}');`;
    console.log(chalk.blue(sql));
    connection.query(sql, (error, results, fields) => {
      res.send({
        result: results[0]
      });
    });
  },
  addProduct: (req, res) => {
    const {
      product_name,
      product_Id,
      price_per_unit,
      group_Id,
      description,
      remaining_quantity
    } = req.body;
    // let connection2 = mysql.createConnection(config);
    let image_url = req.file.path
      .split("\\")
      .slice(1)
      .join("\\\\\\");
    console.log(image_url);
    let sql = `call addProduct('${product_Id}', '${product_name}', '${description}', ${parseInt(
      remaining_quantity
    )}, ${parseInt(price_per_unit)}, '${group_Id}', 1, false, '${image_url}')`;
    console.log(chalk.blue(sql));
    pool.getConnection(function(err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(sql, (error, results, fields) => {
        // When done with the connection, release it.

        connection.release();

        // Handle error after the release.
        if (error) {
          res.send({
            status: "failed",
            error
          });
        } else {
          res.send({
            status: "success",
            result: results.affectedRows
          });
        }

        // Don't use the connection here, it has been returned to the pool.
      });
    });
  },
  deleteProduct: (req, res) => {
    const { product_id } = req.body;

    let sql = `call delProduct('${product_id}')`;
    console.log(chalk.blue(sql));
    connection.query(sql, (error, results, fields) => {
      if (error) {
        return res.send({
          status: "failed",
          error
        });
      }

      res.send({
        status: "success",
        result: results
      });
    });
  },
  updateProduct: (req, res) => {
    const { updateField, value, idForUpdate } = req.body;
    let sql;
    switch (updateField) {
      case "quantity": {
        sql = `call updateQuantity('${idForUpdate}', ${value})`;
        break;
      }
      case "price_per_unit": {
        sql = `call updatePrice('${idForUpdate}', ${value})`;
        break;
      }
      case "product_name": {
        sql = `call updateProductName('${idForUpdate}', '${value}')`;
        break;
      }
    }
    console.log(chalk.blue(sql));
    pool.getConnection(function(err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(sql, (error, results, fields) => {
        // When done with the connection, release it.

        connection.release();

        // Handle error after the release.
        if (error) {
          res.send({
            status: "failed",
            error
          });
        } else {
          res.send({
            status: "success",
            result: results.affectedRows
          });
        }

        // Don't use the connection here, it has been returned to the pool.
      });
    });
  },
  signIn: (req, res) => {
    let { username, password } = req.body;

    let sql = `select checkAccountExist('${username}')`;
    console.log(chalk.blue(sql));
    pool.getConnection(function(err, connection) {
      connection.query(sql, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();

        // the return data look like this [ RowDataPacket { "checkAccountExist('haitran')": 1 } ]
        // extract desired data from returned data
        const match = results[0][Object.keys(results[0])]; // check if username does exist
        if (match) {
          let sql = `select checkAccountMatching('${username}','${password}')`;
          console.log(chalk.blue(sql));
          connection.query(sql, (error, results, fields) => {
            let match = results[0][Object.keys(results[0])];
            if (match) {
              let sql = `select privilege from employee where username = '${username}' and password = '${password}';`;
              connection.query(sql, (error, results, fields) => {
                let isPrivileged = results[0][Object.keys(results[0])];
                console.log(isPrivileged);
                res.send({
                  status: "success",
                  isPrivileged
                });
              });
            } else {
              res.send({
                status: "failed",
                error: "Wrong password!"
              });
            }
          });
        } else {
          res.send({
            status: "failed",
            error: "Username doesn't exist!"
          });
        }

        // Don't use the connection here, it has been returned to the pool.
      });
    });
  },
  signUp: (req, res) => {
    const { username, password, fullname, id } = req.body;

    let sql = `select checkAccountExist('${username}')`;
    console.log(chalk.blue(sql));
    pool.getConnection((err, connection) => {
      connection.query(sql, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        const match = results[0][Object.keys(results[0])]; // check if username does exist

        if (match === 1) {
          return res.send({
            status: "failed",
            error: "Username already exists. Try another one!"
          });
        } else {
          let sql = `insert into employee values('${username}', '${password}', '${fullname}', false, '${id}');`;
          console.log(sql);
          connection.query(sql, (error, results, fields) => {
            if (error) {
              return res.send({
                status: "failed",
                error: "Internal Server Error"
              });
            }
            res.send({
              status: "success",
              result: results
            });
          });
        }
      });
    });
  },
  pdfTemplate: (req, res) => {
    res.render("index", {
      title: "hello",
      data: req.body
    });
  },
  checkOut: async (req, res) => {
    let tempError = null;

    /*
     * The problem with html to pdf is you have to use readFile to read the whole html page
     * which leads to the situation that the page has't loaded the properly CSS, JS or any dymanic data you passed in yet
     * So I figured a way to solve this problem using pug and 2 routes
     * First one will be /checkout to get the data from user like username, receiptId,...etc when you hit PROCEED
     * Then from this route we make another api request to /testpdf so pug can render the html with our data
     * Afterwards, the correct html page will be returned by res.render()
     */

    // const {selected, timestamp, username, receiptId, total} = req.body;
    const respond = await axios({
      url: "http://localhost:5000/api/testpdf",
      method: "POST",
      data: req.body
    });

    let suitableLength = [
      { item: 1, length: "200mm" },
      { item: 2, length: "210mm" },
      { item: 3, length: "220mm" },
      { item: 4, length: "230mm" },
      { item: 5, length: "240mm" },
      { item: 6, length: "250mm" },
      { item: 7, length: "260mm" },
      { item: 8, length: "270mm" },
      { item: 9, length: "280mm" }
    ];
    let { length } = req.body.selected;
    let suited = suitableLength.find(each => each.item === length);

    const { selected, receiptId } = req.body;

    let options = {
      width: "150mm",
      height: suited.length
    };

    // PDF generation
    pdf(respond.data, options, receiptId);

    selected.forEach(each => {
      pool.getConnection(function(err, connection) {
        let sql = `call updateQuantity('${each.product_id}',${each.afterOrder})`;
        console.log(chalk.blue(sql));
        connection.query(sql, (error, results, fields) => {
          // When done with the connection, release it.
          connection.release();
          if (error) {
            tempError = error;
          }

          // Don't use the connection here, it has been returned to the pool.
        });
      });
    });
    if (tempError) {
      return res.send({
        status: "failed",
        error: tempError
      });
    }
    res.send({ status: "success" });
  },
  receipt: (req, res) => {
    const { receiptId, username, timestamp } = req.body;

    let sql = `insert into receipt values('${receiptId}', '${username}', '${timestamp}')`;
    console.log(chalk.blue(sql));
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.send(error);
      }

      res.send({ status: "success" });
    });
  },
  detailReceipt: (req, res) => {
    const { selected, receiptId } = req.body;

    selected.map(each => {
      pool.getConnection(function(err, connection) {
        let sql = `insert into detail_receipt values('${receiptId}', '${each.product_id}', ${each.quantity})`;
        console.log(chalk.blue(sql));
        connection.query(sql, (error, results, fields) => {
          // When done with the connection, release it.
          connection.release();
          if (error) {
            tempError = error;
          }

          // Don't use the connection here, it has been returned to the pool.
        });
      });
    });

    res.send({ status: "success" });
  },
  addLog: (req, res) => {
    const { type, event, username, timestamp, logId } = req.body;

    let sql = `insert into log values ("${logId}","${timestamp}","${event}", "${type}", "${username}")`;
    console.log(chalk.blue(sql));
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(results);
      }
    });
  },
  logInfo: (req, res) => {
    let sql = `select * from log`;
    console.log(chalk.blue(sql));
    connection.query(sql, (error, results, fields) => {
      if (error) {
        return console.log(error);
      }

      res.send({ status: "success", result: results });
    });
  },
  deleteLog: (req, res) => {
    const { id } = req.body;
    let sql = `delete from log where log_id = '${id}';`;
    console.log(chalk.blue(sql));
    connection.query(sql, (err, results, fields) => {
      if (err) {
        return res.send({ status: "failed", error });
      }

      res.send({ status: "success", result: results });
    });
  },
  deleteAllLogs: (req, res) => {
    let sql = `delete from log`;
    console.log(chalk.blue(sql));
    connection.query(sql, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.send({ status: "failed", error: err });
      }

      res.send({ status: "success", result: results });
    });
  },
  search: (req, res) => {
    const { key } = req.body;

    let parsed = parseInt(key);

    function filterCases() {
      let statement;
      if (!isNaN(parsed)) {
        statement = `select * from product where product_name like '%${key}%' or product_id like '%${key}%' or groupProduct_id like '%${key}%' or remaining_quantity = ${parseInt(
          key
        )};`;
      } else {
        statement = `select * from product where product_name like '%${key}%' or product_id like '%${key}%' or groupProduct_id like '%${key}%';`;
      }

      return statement;
    }

    let sql = filterCases();
    console.log(chalk.blue(sql));

    connection.query(sql, (error, results, fields) => {
      if (error) {
        return res.send({
          status: "failed",
          error
        });
      }

      res.send({
        status: "success",
        result: results
      });
    });
  },
  getGroupId: (req, res) => {
    let sql = `call getAllGroupProducts();`;

    connection.query(sql, (error, results, fields) => {
      if (error) {
        return res.send({
          status: "failed",
          error
        });
      }

      res.send({
        status: "success",
        result: results
      });
    });
  }
};
