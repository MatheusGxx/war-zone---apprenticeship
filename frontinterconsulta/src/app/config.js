import dotenv from 'dotenv'
dotenv.config()

export const config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'localhost:8080', // Change the default value accordingly
};
  
