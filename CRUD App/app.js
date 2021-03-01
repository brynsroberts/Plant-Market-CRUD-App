var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({
	defaultLayout : 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7802);

/*********************************************************************************
 * Home Page
 *********************************************************************************/
app.get('/', function(req, res, next) {
	res.render('index');
});

/*********************************************************************************
 * Update Plants Page
 *********************************************************************************/
var PLANT_TO_UPDATE;

app.get('/updateSelectPlant', function (req, res, next) {
	var query = req.query.plants;
	if (query == null) {
		var context = {};
		mysql.pool.query("SELECT plant_id, genus, variety from Plants;", function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err);
				return;
			}
			plants = populatePlantDropdrown(context, rows);
			res.render('updateSelectPlant', { plants: plants });
		});
	} else {
		console.log("getting plant_id:")
		PLANT_TO_UPDATE = String(query).split('-', 1);
		console.log(PLANT_TO_UPDATE);
		res.redirect('/updateSelectedPlant?plant_id=' + String(PLANT_TO_UPDATE[0]))
	}
});

app.get('/updateSelectedPlant', function (req, res, next) {
	var query = req.query;
	console.log(query)
	if (query.plant_id != null) {
		PLANT_TO_UPDATE = query.plant_id;
		console.log("update plant_id: " + PLANT_TO_UPDATE)
		res.render('updateSelectedPlant')
	} else
	if (query.genus != '' || query.variety != '' || query.cost != '' || query.stock != '') {
		if (query.genus != '') {
			mysql.pool.query(
				"UPDATE Plants SET genus=? WHERE plant_id=?",
				[String(query.genus), PLANT_TO_UPDATE],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						next(err);
						return;
					}
				}
			)
		}
		if (query.variety != '') {
			mysql.pool.query(
				"UPDATE Plants SET variety=? WHERE plant_id=?",
				[String(query.variety), PLANT_TO_UPDATE],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						next(err);
						return;
					}
				}
			)
		}
		if (query.cost != '') {
			mysql.pool.query(
				"UPDATE Plants SET cost=? WHERE plant_id=?",
				[String(query.cost), PLANT_TO_UPDATE],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						next(err);
						return;
					}
				}
			)
		}
		if (query.stock != '') {
			mysql.pool.query(
				"UPDATE Plants SET stock=? WHERE plant_id=?",
				[String(query.stock), PLANT_TO_UPDATE],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						next(err);
						return;
					}
				}
			)
		}
		PLANT_TO_UPDATE = null;
		renderViewPlantsPage(res)
	} else {
		mysql.pool.query("SELECT * FROM Plants WHERE plant_id=?",
			[PLANT_TO_UPDATE],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					next(err);
					return;
				}
				console.log(rows);
			}
		)
		renderViewPlantsPage(res);
		PLANT_TO_UPDATE = null;
	}
});

/*********************************************************************************
 * Delete Plants Page
 *********************************************************************************/
app.get('/deleteSelectedPlant', function (req, res, next) {
	var query = req.query.plants;
	if (query == null) {
		var context = {};
		mysql.pool.query("SELECT plant_id, genus, variety from Plants;", function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err);
				return;
			}
			plants = populatePlantDropdrown(context, rows);
			res.render('deleteSelectedPlant', { plants: plants });
		});
	} else {
		var selected_id = String(query).split('-', 1);
		console.log("delete query defined: " + selected_id);
		deleteplant(selected_id);
		renderViewPlantsPage(res);
	}
});

function deleteplant(plant_id) {
	console.log("deleting from Plants_Orders: " + plant_id);
	// update plants_orders table
	mysql.pool.query(
		"DELETE FROM Plants_Orders WHERE plant_id=?",
		[plant_id],
		function (err, results) {
			if (err) {
				next(err);
				return;
			}
		}
	);
	console.log("deleting from Plants: " + plant_id);
	// update plants table
	mysql.pool.query(
		"DELETE FROM Plants WHERE plant_id=?",
		[plant_id],
		function (err, results) {
			if (err) {
				next(err);
				return;
			}
		}
	);
}

/*********************************************************************************
 * Search Customers Orders Page
 *********************************************************************************/
app.get('/searchCustomersOrders', function (req, res, next) {
	var query = req.query.customers;
	console.log(query)
	if (query == null) {
		var context = {};
		mysql.pool.query("SELECT customer_id, first_name, last_name from Customers;", function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err);
				return;
			}
			customers = populateCustomerDropdown(context, rows);
			res.render('searchCustomersOrders', { customers: customers });
		});
	} else {
		var customer_id = String(query).split('-', 1);
		console.log("search query detected: " + customer_id);
		var plants_orders = {};
		mysql.pool.query(
			"SELECT * FROM Plants_Orders " +
			"INNER JOIN Orders " +
			"ON Orders.order_id = Plants_Orders.order_id " +
			"WHERE Orders.customer_id =?",
			[customer_id],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					next(err);
					return;
				}
				plants_orders.results = rows;
				console.log("plants_orders:");
				console.log(plants_orders);
				res.render('searchResults', plants_orders);
			}
		)
	}
});

app.get('/searchResults', function (req, res, next) {
	res.render('searchResults');
});

function populateCustomerOrderSearchPage(customer_id) {
	console.log("customer orders for customer_id: " + customer_id);
	// get customer's plant orders

}

/*********************************************************************************
 * View Pages
 *********************************************************************************/
app.get('/customers', function(req, res, next) {
	if (req.query.first_name && req.query.last_name && req.query.email && req.query.phone) {
		var context = { first_name: '', last_name: '', email: '', phone: '', address: '' };
		context.first_name = req.query.first_name;
		context.last_name = req.query.last_name;
		context.email = req.query.email;
		context.phone = req.query.phone;
		context.address_id = req.query.address;

		if (context.address_id == 'null') {
			mysql.pool.query(
				'INSERT INTO Customers (`email`, `first_name`, `last_name`, `phone`) VALUES (?,?,?,?)',
				[
					context.email,
					context.first_name,
					context.last_name,
					context.phone
				],
				function(err, results) {
					if (err) {
						next(err);
						return;
					}

					res.render('customer_complete');
				}
			);
		} else {
			mysql.pool.query(
				'INSERT INTO Customers (`address_id`, `email`, `first_name`, `last_name`, `phone`) VALUES (?,?,?,?,?)',
				[
					context.address_id,
					context.email,
					context.first_name,
					context.last_name,
					context.phone
				],
				function(err, results) {
					if (err) {
						next(err);
						return;
					}

					res.render('customer_complete');
				}
			);
		}
	} else {
		var customers = {};
		mysql.pool.query('SELECT * FROM Customers', function(err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			customers.results = rows;

			mysql.pool.query('SELECT * FROM Addresses', function(err, rows, fields) {
				if (err) {
					next(err);
					return;
				}
				customers.addresses = rows;
				res.render('customers', customers);
			});
		});
	}
});

app.get('/addresses', function(req, res, next) {
	if (req.query.street && req.query.city && req.query.state && req.query.zip) {
		var context = { street: '', city: '', state: '', zip: '' };
		context.street = req.query.street;
		context.city = req.query.city;
		context.state = req.query.state;
		context.zip = req.query.zip;
		mysql.pool.query(
			'INSERT INTO Addresses (`street`, `city`, `state`, `zip`) VALUES (?,?,?,?)',
			[
				context.street,
				context.city,
				context.state,
				context.zip
			],
			function(err, results) {
				if (err) {
					next(err);
					return;
				}

				res.render('address_complete');
			}
		);
	} else {
		var addresses = {};
		mysql.pool.query('SELECT * FROM Addresses', function(err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			addresses.results = rows;
			res.render('addresses', addresses);
		});
	}
});

app.get('/plants', function(req, res, next) {
	if (req.query.genus && req.query.variety && req.query.cost && req.query.stock) {
		var context = { genus: '', variety: '', cost: '', stock: '' };
		context.genus = req.query.genus;
		context.variety = req.query.variety;
		context.cost = req.query.cost;
		context.stock = req.query.stock;
		mysql.pool.query(
			'INSERT INTO Plants (`genus`, `variety`, `cost`, `stock`) VALUES (?,?,?,?)',
			[
				context.genus,
				context.variety,
				context.cost,
				context.stock
			],
			function(err, results) {
				if (err) {
					next(err);
					return;
				}
				renderViewPlantsPage(res)
			}
		);
	} else {
		renderViewPlantsPage(res)
	}
});

app.get('/orders', function(req, res, next) {
	if (req.query.customer_id) {
		var plants_ordered = {};
		for (const key in req.query) {
			if (key != 'customer_id') {
				plants_ordered[key] = req.query[key];
			}
		}

		var total_cost = 0;
		mysql.pool.query('SELECT `plant_id`, `cost` FROM Plants', function(err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			var plants_costs = JSON.parse(JSON.stringify(rows));
			for (const plant in plants_costs) {
				total_cost += plants_costs[plant].cost * plants_ordered[plants_costs[plant].plant_id];
			}

			mysql.pool.query(
				'INSERT INTO Orders (`customer_id`, `total_cost`) VALUES (?,?)',
				[
					req.query.customer_id,
					total_cost
				],
				function(err, results) {
					if (err) {
						next(err);
						return;
					}

					mysql.pool.query('SELECT MAX(order_id) FROM Orders', function(err, rows, fields) {
						if (err) {
							next(err);
							return;
						}

						var latest_id = JSON.parse(JSON.stringify(rows));
						var max_id = 0;
						for (const num in latest_id[0]) {
							max_id = latest_id[0][num];
						}
						for (const plant in plants_ordered) {
							if (plants_ordered[plant] > 0) {
								mysql.pool.query(
									'INSERT INTO Plants_Orders (`order_id`, `plant_id`, `quantity`) VALUES (?,?,?)',
									[
										max_id,
										plant,
										plants_ordered[plant]
									],
									function(err, results) {
										if (err) {
											next(err);
											return;
										}
									}
								);
							}
						}

						res.render('order_complete');
					});
				}
			);
		});
	} else {
		var orders = {};
		mysql.pool.query('SELECT * FROM Orders', function(err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			orders.results = rows;

			mysql.pool.query('SELECT * FROM Customers', function(err, rows, fields) {
				if (err) {
					next(err);
					return;
				}
				orders.customers = rows;

				mysql.pool.query('SELECT * FROM Plants', function(err, rows, fields) {
					if (err) {
						next(err);
						return;
					}
					orders.plants = rows;
					res.render('orders', orders);
				});
			});
		});
	}
});

app.get('/plants_orders', function(req, res, next) {
	var plants_orders = {};
	mysql.pool.query('SELECT * FROM Plants_Orders', function(err, rows, fields) {
		if (err) {
			next(err);
			return;
		}
		plants_orders.results = rows;
		res.render('plants_orders', plants_orders);
	});
});

/*********************************************************************************
 * Insert Completed Page
 *********************************************************************************/
app.get('/order_complete', function(req, res, next) {
	res.render('order_complete');
});

app.get('/plant_complete', function(req, res, next) {
	res.render('plant_complete');
});

app.get('/address_complete', function(req, res, next) {
	res.render('address_complete');
});

app.get('/customer_complete', function(req, res, next) {
	res.render('customerr_complete');
});

/*********************************************************************************
 * Error Page
 *********************************************************************************/
app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// populate plant dropdown selection with options
function populatePlantDropdrown(context, rows) {
	context.results = rows;
	var plants = [];
	for (var i = 0; i < rows.length; i++) {
		var plant_id = rows[i].plant_id;
		var plant_genus = rows[i].genus;
		var plant_variety = rows[i].variety;
		var plant = plant_id + "-" + plant_genus + " " + plant_variety;
		plants.push(plant);
	}
	console.log("logging from populatePlantDropdown:");
	console.log(plants);
	return plants
}

// populate customer dropdown selection with options
function populateCustomerDropdown(context, rows) {
	context.results = rows;
	var customers = [];
	for (var i = 0; i < rows.length; i++) {
		var customer_id = rows[i].customer_id;
		var first_name = rows[i].first_name;
		var last_name = rows[i].last_name;
		var customer = customer_id + "-" + first_name + " " + last_name;
		customers.push(customer);
	}

	console.log("logging from populateCustomerDropdown:");
	console.log(customers);
	return customers;
}

// render view plants page
function renderViewPlantsPage(res) {
	var plants = {};
	mysql.pool.query('SELECT * FROM Plants', function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}
		plants.results = rows;
		res.render('plants', plants);
	})
}