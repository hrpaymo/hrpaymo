\connect template1;
DROP DATABASE IF EXISTS paymo;
CREATE DATABASE paymo;
\connect paymo;

CREATE TABLE USERS (
  id SERIAL PRIMARY KEY,
  username varchar(20) UNIQUE NOT NULL,
  first_name varchar(20) NOT NULL,
  last_name varchar(20) NOT NULL,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  phone varchar(11) UNIQUE NOT NULL,
  password varchar(64) NOT NULL,
  email varchar(64) UNIQUE NOT NULL,
  avatar_url varchar(500)
);

CREATE TABLE USERS_TRANSACTIONS (
  txn_id SERIAL PRIMARY KEY,
  payer_id INT REFERENCES USERS(id), 
  payee_id INT REFERENCES USERS(id)
);

CREATE TABLE TRANSACTIONS (
  txn_id int PRIMARY KEY REFERENCES USERS_TRANSACTIONS(txn_id),
  amount NUMERIC(10,2),
  note VARCHAR(1000),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BALANCE (
  user_id INT PRIMARY KEY REFERENCES USERS(id),
  amount NUMERIC(10,2)
);
