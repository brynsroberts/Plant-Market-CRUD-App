-- These are some Database Manipulation queries for a partially implemented Project Website 
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.

-- select all for the view entity tables
SELECT * FROM Customers;
SELECT * FROM Addresses;
SELECT * FROM Plants;
SELECT * FROM Orders;

-- get a single plant's data for the Update Plants Plants form
SELECT genus, variety, cost, stock FROM Plants WHERE plant_id = :plant_id_selected_on_form;

-- get all order info associated with a customer for the search customers orders page
SELECT * FROM Orders WHERE customer_id = :customer_id_selected_on_form;

-- get cost of plant for Order total_cost calculation
SELECT cost FROM Plants WHERE plant_id = :plant_id_specified_by_js;

-- insert simple record into table
INSERT INTO Customers (address_id, email, first_name, last_name, phone) VALUES (
    :address_id_from_dropdown, 
    :emailInput, 
    :first_nameInput, 
    :last_nameInput, 
    :phoneInput
);
INSERT INTO Addresses (street, city, state, zip) VALUES (:streetInput, :cityInput, :stateInput, :zipInput);
INSERT INTO Plants (genus, variety, cost, stock) VALUES (:genusInput, :varietyInput, :costInput, :stockInput);
INSERT INTO Orders (customer_id, total_quantity, total_cost) VALUES (
    :customer_idInput, 
    :total_quantity_calculated_from_js,
    :total_cost_calculated_from_js
);

-- associate a order with plant (M-to-M relationship addition)
INSERT INTO Plants_Orders (order_id, plant_id, quantity) VALUES (:order_id_from_dropdown_input, :plant_id_from_dropdown_input, :quantityInput);

-- update plant stock based on Plants_Orders
UPDATE Plants SET stock = :stock_calculated_from_js;

-- delete a plant
DELETE FROM Plants WHERE plant_id = :plant_id_selected_from_form;

-- dis-associate a plant from an order (M-to-M relationship deletion)
DELETE FROM Plants_Orders WHERE order_id = :order_id_from_form AND plant_id = :plant_id_from_form;
