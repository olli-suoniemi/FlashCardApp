<h1> App for studying words / FlashCardApp </h1>

This app can be used for creating quizzes from your own created words. This tool is handy for teachers and students who are looking for a easy way to create flashcards out of your own words. On the first version of the app only the admin has the control of creating new words and deleting them. Later that ability may be allowed for all. 

The main reason this app was built was the need for a tool to learn new languages. My aim is to use this in my Russian studies to help me learn new words and 
phrases. This is a traditional stylish "flashcard" app which can be used for basic word quizzing.

The second reason for this app, was to develop and improve web development skills. I built this as a late-summer-project on a summer break from university in 2021.

---

The app can be tested online in [here](https://learning-flashcardapp.herokuapp.com/)

---

<h2> Local testing </h2>

Use the database table statements below to create needed tables to run the program. Also remember to insert your database credentials.
In order to run the program locally you have to install Deno. [Installation guidelines for Deno](https://deno.land/manual/getting_started/installation). <br>Use version 1.11.5. You can set it by command: <code> deno upgrade --version 1.11.5 </code><br>

---

In order to run the app locally run this command in the root of the application: 
<code>deno run --unstable --allow-all --watch run-locally.js</code>

---

<code>
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password CHAR(60)
);
</code>
<br>
<br>
<code>
CREATE TABLE words(
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  lang TEXT NOT NULL
);
</code>
<br>
<br>
<code>
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  word_id INTEGER REFERENCES words(id),
  answer TEXT NOT NULL,
  lang TEXT NOT NULL
);
</code>
<br>
<br>
<code>
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);
</code>
<br>
<br>
<code>
CREATE TABLE user_roles (
  role_id INTEGER REFERENCES roles(id),
  user_id INTEGER REFERENCES users(id)
);
</code>
<br>
<br>
<code>
INSERT INTO roles (name) VALUES ('ADMIN');
</code>
<br>
<br>
<code>
INSERT INTO user_roles (role_id, user_id)
  VALUES(
          (SELECT id FROM roles WHERE name = 'ADMIN'),
          (SELECT id FROM users WHERE username = 'admin')
        );
</code>
<br>
<br>
<code>
CREATE UNIQUE INDEX ON users((lower(username)));
</code>
<br>
<br>
