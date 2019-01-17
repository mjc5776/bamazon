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
    queryStr = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products"
    connection.query(queryStr, function (err, results) {
        if (err) throw err;
        console.log("\n\n");
        console.log('BAMAZON');

        var t = new Table;

        results.forEach(function (product) {
            t.cell('Item', product.item_id);
            t.cell('Product', product.product_name);
            t.cell('Department', product.department_name);
            t.cell('Price', product.price);
            t.cell('Qty', product.stock_quantity);
            t.newRow();
        });
        console.log(t.toString());
        productToBuy();
    });

};



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
            var query = "SELECT * FROM products WHERE ?"
            connection.query(query, {
                item_id: answer.id
            }, function (err, res) {
                
                if (res[0].stock_quantity < answer.qty) {
                    console.log("Insufficient Quantity");
                    listProducts();
                } else {
                    
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                              stock_quantity: res[0].stock_quantity - answer.qty  
                            },
                            {
                                item_id: answer.id
                            }

                        ],
                        function(error){
                            if (error) throw err;
                            var orderTotal = (answer.qty * res[0].price)
                            console.log("Order Complete. Your total is: $" + orderTotal);
                            
                            closeConnection();
                        }
                    )   
                    
                    
                }


            });
        });



};



function closeConnection() {
    connection.end();
};