import pkg from 'pg';
const { Pool } = pkg;

const psgrsAccount = new Pool({
  host: "localhost",
  user: "postgres",
  password: "mango",
  database: "company",
  port: 5432,
});

export default psgrsAccount;
