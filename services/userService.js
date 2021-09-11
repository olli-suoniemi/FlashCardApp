import { executeQuery } from "../database/database.js";

const addUser = async (username, password) => {
  await executeQuery(
    `INSERT INTO users
      (username, password)
        VALUES ($1, $2)`,
    username,
    password
  );
};

const findUserByUsername = async (username) => {
    const result = await executeQuery(
      "SELECT * FROM users WHERE username = $1",
      username,
    );
    if (result) {
      return result.rows;
    };
};
  
const deleteById = async (id) => {
  await executeQuery(
    "DELETE FROM users WHERE id = $1",
      id
  );
};

const getRoles = async(id) => {
    const result = await executeQuery(
        `SELECT name FROM roles
          JOIN user_roles ON roles.id = user_roles.role_id
            WHERE user_roles.user_id = $1;`,
          id
    );

    return result.rows;
};
export { addUser, findUserByUsername, deleteById, getRoles };