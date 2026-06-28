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

SELECT statements naturally return data by default. INSERT, UPDATE, and DELETE do not.

Here is the deeper breakdown of why we use RETURNING * for some and not others, even though the Node.js pg library always puts the final data inside the result.rows array.

1. The GET Route (SELECT)
The entire core purpose of a SELECT query is to fetch data. When you run SELECT * FROM students, PostgreSQL knows it is supposed to hand you data back.

What Postgres does: It grabs the data and sends it directly to your Node server over the network.

What the pg library does: It catches that data and neatly packages it into result.rows.

Result: No special commands needed.

2. The POST / PUT / DELETE Routes (INSERT, UPDATE, DELETE)
The primary purpose of these commands is to modify the database, not to read it.

By default, if you run INSERT INTO students (name) VALUES ('Aditya'), PostgreSQL just does the job and replies with a simple status receipt: "Success, 1 row affected." It does not send the actual row data back.

The Problem: If you want to send the newly created student back to the frontend client as JSON, you would normally have to waste time doing a second, separate SELECT query just to fetch the ID and data of what you just inserted.

The Solution (RETURNING *): This is a special PostgreSQL feature that tells the database: "Do the insert/update/delete, AND then instantly act like a SELECT statement and send that specific row's data back to me."

Summary: How data gets into result.rows
The pg library will always create a result.rows array. It is up to your SQL string to make sure data is actually sent from the database to fill it.