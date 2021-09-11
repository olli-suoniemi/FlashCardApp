import { Pool } from "../deps.js";

const CONCURRENT_CONNECTIONS = 2;
const connectionPool = new Pool({
  hostname: ${{ secrect.PGHOST }},
  database: ${{ secrect.PGDATABASE }},
  user: ${{ secrect.PGDATABASE }},
  password: ${{ secrect.PGPASSWORD }},
  port: 5432,
}, CONCURRENT_CONNECTIONS);

const executeQuery = async (query, ...args) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }

  return response;
};

export { executeQuery };