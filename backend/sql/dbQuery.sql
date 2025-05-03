-- drop database if exists pcstore;

-- create database if not exists pcstore;

-- use pcstore;

DROP TABLE IF EXISTS verification_codes CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
drop table if exists vendors cascade;
drop table if exists product_images cascade;
drop table if exists product_variants cascade;
drop table if exists variant_attributes cascade;
drop table if exists product_category cascade;

CREATE TABLE employees (
  employeeID int PRIMARY KEY,
  lastName VARCHAR(50) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  jobTitle VARCHAR(50) NOT NULL
);

CREATE TABLE customers (
  customerID int PRIMARY KEY,
  customerName varchar(100) NOT NULL,
  customerLastName varchar(50) NOT NULL,
  customerFirstName varchar(50) NOT NULL,
  userPassword VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phoneNumber VARCHAR(15) NOT NULL,
  addressLine VARCHAR(100) DEFAULT NULL,
  city VARCHAR(50) DEFAULT NULL,
  state VARCHAR(50) DEFAULT NULL,
  postalCode VARCHAR(15) DEFAULT NULL,
  country VARCHAR(50) DEFAULT NULL,
  salesRepEmployeeID INT DEFAULT NULL,
  creditLimit DECIMAL(10,2) DEFAULT NULL,
  FOREIGN KEY (salesRepEmployeeID) REFERENCES employees(employeeID) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    categoryID INT primary key,
    categoryName VARCHAR(255) not null unique
);

CREATE TABLE vendors (
  vendorID int PRIMARY KEY,
  vendorName VARCHAR(255) UNIQUE NOT NULL,
  contactEmail VARCHAR(255),
  phone VARCHAR(20)
);

CREATE TABLE products (
  productID int PRIMARY KEY,
  productName VARCHAR(70) NOT NULL,
  productSKU VARCHAR(255) unique DEFAULT NULL,
  productVendor VARCHAR(50) DEFAULT NULL,
  productDescription TEXT DEFAULT NULL,
  quantityInStock INT NOT NULL check (quantityInStock > 0),
  price DECIMAL(10,2) NOT NULL check (price > 0),
  vendorID int not null,
  foreign key (vendorID) references vendors(vendorID) on update cascade
);

-- Bảng lưu nhiều ảnh cho mỗi sản phẩm
CREATE TABLE product_images (
    imageID INT PRIMARY KEY,
    productID INT NOT NULL,
    imageURL VARCHAR(500) NOT NULL,
    isThumbnail BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE
);

-- Bảng lưu biến thể sản phẩm
CREATE TABLE product_variants (
    variantID INT PRIMARY KEY,
    productID INT NOT NULL,
    variantSKU VARCHAR(255) UNIQUE NOT NULL,
    variantName VARCHAR(255) DEFAULT NULL, -- VD: "8GB RAM / 256GB SSD / i5"
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    quantityInStock INT NOT NULL CHECK (quantityInStock >= 0),
    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE
);

-- (Optional) Bảng lưu thuộc tính cho biến thể (nếu muốn cực flexible)
CREATE TABLE variant_attributes (
    attributeID INT PRIMARY KEY,
    variantID INT NOT NULL,
    attributeName VARCHAR(100) NOT NULL, -- VD: "RAM", "CPU", "Color"
    attributeValue VARCHAR(255) NOT NULL, -- VD: "8GB", "i5-1235U", "Silver"
    FOREIGN KEY (variantID) REFERENCES product_variants(variantID) ON DELETE CASCADE
);

create table if not exists product_category(
	productID int not null,
    categoryID int not null,
    primary key(productID, categoryID),
    foreign key(productID) references products(productID) on update cascade,
	foreign key(categoryID) references categories(categoryID) on update cascade
);

-- CREATE TYPE order_status AS ENUM ('Pending','Processing','Shipped','Cancelled');
CREATE TABLE orders (
  orderNumber int PRIMARY KEY,
  orderDate DATE NOT NULL,
  requiredDate DATE NOT NULL,
  shippedDate DATE DEFAULT NULL,
  status VARCHAR(15) NOT NULL,
  comments TEXT,
  customerID INT NOT NULL,
  FOREIGN KEY (customerID) REFERENCES customers(customerID) ON UPDATE CASCADE
);
-- ALTER TABLE orders ALTER COLUMN status TYPE order_status USING status::order_status;

CREATE TABLE order_items (
  orderNumber INT NOT NULL,
  productID int NOT NULL,
  quantityOrdered INT NOT NULL check (quantityOrdered > 0),
  priceEach DECIMAL(10,2) NOT NULL check (priceEach > 0),
  PRIMARY KEY (orderNumber, productID),
  FOREIGN KEY (orderNumber) REFERENCES orders(orderNumber) ON UPDATE CASCADE,
  FOREIGN KEY (productID) REFERENCES products(productID) ON UPDATE CASCADE
);

CREATE TABLE payments (
  paymentID SERIAL PRIMARY KEY,
  customerID INT NOT NULL,
  paymentDate DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paymentMethod VARCHAR(50) DEFAULT 'Check',
  FOREIGN KEY (customerID) REFERENCES customers(customerID) ON UPDATE CASCADE
);

CREATE TABLE verification_codes (
  id int PRIMARY KEY,
  customerID INT NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (customerID),
  FOREIGN KEY (customerID) REFERENCES customers(customerID) ON UPDATE CASCADE
);