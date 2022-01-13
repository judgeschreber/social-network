 --DROP TABLE IF EXISTS users;
  --DROP TABLE IF EXISTS reset_codes;

 CREATE TABLE users(
     id SERIAL PRIMARY KEY,
     first VARCHAR(255) NOT NULL,
     last VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     image_url VARCHAR(255),
     bio VARCHAR,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

  CREATE TABLE reset_codes(
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) NOT NULL,
     code VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE friendships( 
  id SERIAL PRIMARY KEY, 
  sender_id INT REFERENCES users(id) NOT NULL,
  recipient_id INT REFERENCES users(id) NOT NULL,
  accepted BOOLEAN DEFAULT false);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

--INSERT INTO chat_messages (user_id, message) VALUES ('145', 'Hey everyone, nice to meet you...');
--INSERT INTO chat_messages (user_id, message) VALUES ('101', 'Hello there!');


CREATE TABLE doodles (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ,
    recipient_id INT NOT NULL REFERENCES users(id) ,
    image_url VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );