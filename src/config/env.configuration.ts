export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database_url: process.env.DATABASE_URL,
  jwt_key: process.env.JWT_KEY,
});
