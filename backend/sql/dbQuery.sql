drop table if exists customers cascade;
drop table if exists products cascade;
drop table if exists orders cascade;
drop table if exists employees cascade;
drop table if exists payments cascade;

CREATE TABLE employees (
  employeeID int,
  lastName varchar(50) NOT NULL,
  firstName varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  reportsTo int DEFAULT NULL,
  jobTitle varchar(50) NOT NULL,
  PRIMARY KEY (employeeID),
  FOREIGN KEY (reportsTo) REFERENCES employees (employeeID)
);

CREATE TABLE customers (
  customerID int,
  customerName varchar(50) NOT NULL,
  customerLastName varchar(50) NOT NULL,
  customerFirstName varchar(50) NOT NULL,
  userPassword varchar(255) NOT NULL, 
  email varchar(255) UNIQUE NOT NULL,
  phoneNumber varchar(50) NOT NULL,
  addressLine1 varchar(50) DEFAULT NULL,
  addressLine2 varchar(50) DEFAULT NULL,
  city varchar(50) DEFAULT NULL,
  state varchar(50) DEFAULT NULL,
  postalCode varchar(15) DEFAULT NULL,
  country varchar(50) DEFAULT NULL,
  salesRepemployeeID int DEFAULT NULL,
  creditLimit decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (customerID),
  FOREIGN KEY (salesRepemployeeID) REFERENCES employees (employeeID)
);

CREATE TABLE products (
  productID varchar(15),
  productName varchar(70) NOT NULL,
  productScale varchar(10) DEFAULT NULL,
  productVendor varchar(50) DEFAULT NULL,
  productDescription text DEFAULT NULL,
  quantityInStock int NOT NULL,
  price decimal(10,2) NOT NULL,
  PRIMARY KEY (productID)
);

CREATE TABLE orders (
  orderNumber int,
  orderDate date NOT NULL,
  requiredDate date NOT NULL,
  shippedDate date DEFAULT NULL,
  status varchar(15) NOT NULL,
  comments text,
  customerID int NOT NULL,
  PRIMARY KEY (orderNumber),
  FOREIGN KEY (customerID) REFERENCES customers (customerID)
);

CREATE TABLE payments (
  customerID int,
  checkNumber varchar(50) NOT NULL,
  paymentDate date NOT NULL,
  amount decimal(10,2) NOT NULL,
  PRIMARY KEY (customerID,checkNumber),
  FOREIGN KEY (customerID) REFERENCES customers (customerID)
);

CREATE TABLE IF NOT EXISTS verification_codes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email)
);