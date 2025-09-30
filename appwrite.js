import { Client, Account, Databases } from "appwrite";

// Default values for development/demo mode
const DEFAULT_ENDPOINT = "https://cloud.appwrite.io/v1";
const DEFAULT_PROJECT_ID = "68d6cf15003d05dbd780"; // Replace with your actual Appwrite project ID

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || DEFAULT_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || DEFAULT_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
