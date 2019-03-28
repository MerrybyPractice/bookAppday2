DROP TABLE IF EXISTS books;
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(355),
    img TEXT,
    author VARCHAR(355),
    description TEXT,
    ISBN10 VARCHAR(100),
    ISBN13 VARCHAR(100)
);

