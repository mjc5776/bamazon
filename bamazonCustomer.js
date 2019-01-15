var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("easy-table")
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

listProducts();


function listProducts() {
    //queryStr = "SELECT item_id, product_name, department_name, price FROM products"
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function (err, results) {
        if (err) throw err;
        console.log("\n\n");
        console.log('BAMAZON');
        
        var t = new Table;
        //console.log(products);
        
        results.forEach(function(product) {
            t.cell('Item', product.item_id);
            t.cell('Product', product.product_name);
            t.cell('Department', product.department_name);
            t.cell('Price', product.price);
            t.cell('Qty'), product.stock_quantity 
            t.newRow();   
        }); 
       console.log(t.toString());
       
        });
    };


    //productToBuy();
   
    function productToBuy() {
        inquirer
            .prompt([{
                    name: "id",
                    type: "input",
                    message: "What is the ID of the product you want to purchase?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "qty",
                    type: "input",
                    message: "How many units would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                var query = "SELECT item_id as ProductID, stock_quantity FROM products WHERE ?"
                connection.query(query, {
                    item_id: answer.id
                }, function (err, res) {
                    console.log(res);

                })
            })
    };
