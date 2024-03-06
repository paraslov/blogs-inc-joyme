export const AppSettings = {
  PORT: 3003,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: '1h',
  MONGO_URI: process.env.MONGO_URI,
}
