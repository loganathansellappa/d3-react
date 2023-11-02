export type ServerConfig = {
  baseUrl: string;
  apiKey: string;
};
export const serverData = () => {
  return {
    baseUrl: process.env.DATA_URL,
    apiKey: process.env.API_KEY,
  } as ServerConfig;
};
