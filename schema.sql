DROP TABLE IF EXISTS books;
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150),
    author VARCHAR(150),
    description TEXT,
    ISBN10 VARCHAR(15),
    ISBN13 VARCHAR(20)
);