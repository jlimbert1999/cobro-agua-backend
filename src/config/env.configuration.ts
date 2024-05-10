export interface EnvConfig {
  mongodb_url: string;
  jwt_key: string;
}
export const EnvConfiguration = (): EnvConfig => ({
  mongodb_url: process.env.MONGODB_URL,
  jwt_key: process.env.JWT_KEY,
});
