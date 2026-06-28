RETURNING * is a specific feature of PostgreSQL (and a few other databases like SQLite and MariaDB), but it does not exist in standard MySQL.

This exact difference is one of the main reasons many backend engineers prefer PostgreSQL over MySQL. Here is how the two handle the exact same scenario if you want to insert a user and then send that user's data back to the frontend:

The PostgreSQL Way (1 Round Trip)
As you just learned, Postgres can do it in one single step.

SQL
-- Postgres does the insert and immediately hands you the data back
INSERT INTO students (name) VALUES ('Aditya') RETURNING *;
The MySQL Way (2 Round Trips)
Because MySQL doesn't have RETURNING, it only replies with a receipt that contains the new insertId. To get the full row, your Node.js server has to make a second trip to the database.

JavaScript
// Step 1: Insert the data
const insertQuery = "INSERT INTO students (name) VALUES ('Aditya')";
const [receipt] = await mysqlPool.query(insertQuery); 

// Step 2: Use the receipt's 'insertId' to run a second SELECT query
const selectQuery = "SELECT * FROM students WHERE id = ?";
const [newStudent] = await mysqlPool.query(selectQuery, [receipt.insertId]);

res.status(201).json(newStudent[0]);
That second round trip in MySQL means more network traffic and slightly slower response times, which is why Postgres's RETURNING clause is so powerful for APIs!