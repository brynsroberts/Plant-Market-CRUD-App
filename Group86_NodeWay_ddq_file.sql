-- MySQL data dump
-- Group86
-- Team: Node Way

-- DROP TABLES IF THEY EXIST
DROP TABLE IF EXISTS `Plants_Orders`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Customers`;
DROP TABLE IF EXISTS `Plants`;
DROP TABLE IF EXISTS `Addresses`;

-- Create Addresses Table
CREATE TABLE `Addresses` (
    `address_id` int NOT NULL AUTO_INCREMENT,
    `street` varchar(255) NOT NULL,
    `city` varchar(255) NOT NULL,
    `state` varchar(255) NOT NULL,
    `zip` int NOT NULL,
    PRIMARY KEY (`address_id`)
);

-- Create Plants Table
CREATE TABLE `Plants` (
    `plant_id` int NOT NULL AUTO_INCREMENT,
    `genus` varchar(255) NOT NULL,
    `variety` varchar(255) NOT NULL,
    `cost` float NOT NULL,
    `stock` int NOT NULL,
    PRIMARY KEY (`plant_id`)
);

-- Create Customers Table
CREATE TABLE `Customers` (
    `customer_id` int NOT NULL AUTO_INCREMENT,
    `address_id` int DEFAULT NULL,
    `email` varchar(255) NOT NULL,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `phone` varchar(255) NOT NULL,
    PRIMARY KEY (`customer_id`),
    CONSTRAINT `fk_address_id`
    FOREIGN KEY (`address_id`)
    REFERENCES `Addresses` (`address_id`)
    ON DELETE SET NULL
);

-- Create Orders Table
CREATE TABLE `Orders` (
    `order_id` int NOT NULL AUTO_INCREMENT,
    `customer_id` int NOT NULL,
    `total_quantity` int NOT NULL,
    `total_cost` float NOT NULL,
    PRIMARY KEY (`order_id`),
    CONSTRAINT `fk_customer_id`
    FOREIGN KEY (`customer_id`)
    REFERENCES `Customers` (`customer_id`)
    ON DELETE NO ACTION
);

-- Create Plants_Orders Table
CREATE TABLE `Plants_Orders` (
    `plants_orders_id` int NOT NULL AUTO_INCREMENT,
    `order_id` int NOT NULL,
    `plant_id` int,
    `quantity` int NOT NULL,
    PRIMARY KEY (`plants_orders_id`),
    CONSTRAINT `fk_order_id`
    FOREIGN KEY (`order_id`)
    REFERENCES `Orders` (`order_id`)
    ON DELETE NO ACTION,
    CONSTRAINT `fk_plant_id`
    FOREIGN KEY (`plant_id`)
    REFERENCES `Plants` (`plant_id`)
    ON DELETE SET NULL
);

-- Data dump for Addresses
INSERT INTO `Addresses` (`street`, `city`, `state`, `zip`)
VALUES ('1100 63rd Street', 'Sacramento', 'CA', '95820'),
('3450 Ablerta Blvd', 'Portland', 'OR', '99421'),
('9861 Big Drive Way', 'Tulsa', 'AZ', '65491'),
('6532 Cold Place Street', 'Chico', 'CA', '98765');

-- Data dump for Plants
INSERT INTO `Plants` (`genus`, `cost`, `stock`, `variety`)
VALUES ('Eucalyptus', '105', '200', 'cool variety'),
('Rafflesia', '230', '80', 'summer variety'),
('Nepenthes', '300', '110', 'winter variety');

-- Data dump for Customers
INSERT INTO `Customers` (`email`, `first_name`, `last_name`, `phone`, `address_id`)
VALUES ('bob@gmail.com', 'Bob', 'Jones', '9991234567', NULL),
('nancy@gmail.com', 'Nancy', 'Wallow', '123123444', '1'),
('alberto@yahoo.com', 'Albert', 'Grills', '6753234123', '2'),
('guy@gmail.com', 'Guy', 'Cooks', '456788213', '3');

-- Data dump for Orders
INSERT INTO `Orders` (`customer_id`, `total_quantity`, `total_cost`)
VALUES ('1', '1', '210'),
('2', '2', '530'),
('3', '3', '705'),
('4', '1', '230');

-- Data dump for Plants_Orders
INSERT INTO `Plants_Orders` (`order_id`, `plant_id`, `quantity`)
VALUES ('1', '1', '2'),
('2', '2', '1'),
('2', '3', '1'),
('3', '1', '1'),
('3', '3', '2'),
('4', '2', '1');
