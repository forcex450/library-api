import * as dotenv from 'dotenv';

dotenv.config();

interface ConfigType {
  database: {
    uri: string;
  };
  secret: string;
}

const config: ConfigType = {
  database: {
    uri: process.env.MONGO_URI,
  },
  secret: process.env.JWT_SECRET,
};

export default config;
