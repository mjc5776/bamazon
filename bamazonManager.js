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

menuOptions();

function menuOptions() {
    inquirer
        .prompt([{
            type: "list",
            name: "menuSelect",
            message: "Manager Options",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }])
        .then(function (res) {
            switch (res.menuSelect) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProducts();
                    break;

            }
        })
}

function viewProducts() {
    queryStr = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products"
    connection.query(queryStr, function (err, results) {
        if (err) throw err;
        console.log("\n\n");
        console.log('BAMAZON MANAGER');

        var t = new Table;

        results.forEach(function (product) {
            t.cell('Item', product.item_id);
            t.cell('Product', product.product_name);
            //t.cell('Department', product.department_name);
            t.cell('Price', product.price);
            t.cell('Qty', product.stock_quantity);
            t.newRow();
        });
        console.log(t.toString());

    });

};



function viewLowInventory() {

    queryStr = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5"
    connection.query(queryStr, function (err, results) {
        if (err) throw err;
        console.log("\n\n");
        

        var t = new Table;
        
        results.forEach(function (product) {
            t.cell('Item', product.item_id);
            t.cell('Product', product.product_name);
            //t.cell('Department', product.department_name);
            t.cell('Price', product.price);
            t.cell('Qty', product.stock_quantity);
            t.newRow();
        });
        console.log(t.toString());
        
    });
    
};



function addInventory() {
    inquirer
        .prompt([{
                type: "input",
                name: "itemID",
                message: "What is the item id of the product you would like to increase?"
            },

            {
                type: "input",
                name: "itemQty",
                message: "Quantity to add:",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            }

        ])
        .then(function (res) {
            connection.query("Update products Set stock_quantity = stock_quantity + ? WHERE item_id = ?", 
            [res.itemQty, res.itemID], function(err){
                if (err) throw err;
            });
            console.log("Inventory updated successfully.");
            menuOptions();

        });

};

function addProducts() {
    inquirer
        .prompt([{
                type: "input",
                name: "productName",
                message: "What is the name of the new product?"
            },

            {
                type: "input",
                name: "department",
                message: "What department does this product belong to?:"
            },

            {
                type: "input",
                name: "price",
                message: "New product price?:"
            },

            {
                type: "input",
                name: "itemQty",
                message: "Quantity of the new product to add?:",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            }

        ])
        .then(function (res) {
            connection.query(
                "INSERT INTO products SET ?",
            {
            product_name: res.productName,
            department_name: res.department,
            price: res.price,
            stock_quantity: res.itemQty
            },
            function(err) {
                if (err) throw err;
                console.log("New product added successfully.");

            });

        });

};