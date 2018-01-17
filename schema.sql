\connect template1;
DROP DATABASE IF EXISTS paymo;
CREATE DATABASE paymo;
\connect paymo;

CREATE TABLE USERS (
  id NUMERIC(25) PRIMARY KEY,
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

CREATE TABLE FRIENDSHIPS (
  id SERIAL PRIMARY KEY,
  from_user INT REFERENCES USERS(id),
  to_user INT REFERENCES USERS(id),
  verified BOOLEAN NOT NULL,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO USERS (username, first_name, last_name, phone, password, email, avatar_url) VALUES ('Aaron', 'Aaron', 'Pietsch', 1111111111, 'password', 'aaron@hackreactor.com', 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAIA_wDGAAAAAQAAAAAAAAopAAAAJDY5ZTRkYjlhLTM5OTEtNDZhYS1iNGM4LTRmZTk5NmI0MzFlYw.jpg');
INSERT INTO USERS (username, first_name, last_name, phone, password, email, avatar_url) VALUES ('Larry', 'Larry', 'Chang', 2222222222, 'password', 'larry@githell.com', 'https://upload.wikimedia.org/wikipedia/commons/7/77/Avatar_cat.png');
INSERT INTO USERS (username, first_name, last_name, phone, password, email, avatar_url) VALUES ('Will', 'Will', 'Putnam', 3333333333, 'password', 'wsputnam@wustl.edu', 'https://www.thesun.co.uk/wp-content/uploads/2017/02/nintchdbpict0002990093241.jpg?strip=all&w=960');
INSERT INTO USERS (username, first_name, last_name, phone, password, email, avatar_url) VALUES ('Albert', 'Albert', 'Wong', 4444444444, 'password', 'albert@testing.org', 'https://s3-us-west-1.amazonaws.com/lawa-ig/images/null-2018-01-13T16%3A34%3A17-08%3A00.jpg');

INSERT INTO BALANCE (user_id, amount) VALUES (1, 100);
INSERT INTO BALANCE (user_id, amount) VALUES (2, 100);
INSERT INTO BALANCE (user_id, amount) VALUES (3, 100);
INSERT INTO BALANCE (user_id, amount) VALUES (4, 100);

INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (1, 2);
INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (2, 3);
INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (3, 4);
INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (4, 1);
INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (2, 1);
INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (3, 2);
INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (4, 3);
INSERT INTO USERS_TRANSACTIONS (payer_id, payee_id) VALUES (1, 4);

INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (1, 10, 'Hacking fees');
INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (2, 9, 'Cat food');
INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (3, 8, 'VOLCANO GO BOOM BOOM!');
INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (4, 7, 'Roads, bro');
INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (5, 6, 'Cat peed on me');
INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (6, 5, 'Will is my name, volcanoes are my game');
INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (7, 4, 'Gas $$');
INSERT INTO TRANSACTIONS (txn_id, amount, note) VALUES (8, 3, 'Get pwned');

INSERT INTO FRIENDSHIPS (from_user, to_user, verified) VALUES (1, 2, 'false');
INSERT INTO FRIENDSHIPS (from_user, to_user, verified) VALUES (2, 3, 'true');
INSERT INTO FRIENDSHIPS (from_user, to_user, verified) VALUES (3, 4, 'true');
INSERT INTO FRIENDSHIPS (from_user, to_user, verified) VALUES (4, 1, 'false');