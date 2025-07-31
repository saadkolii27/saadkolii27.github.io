// Ce fichier doit être exécuté côté serveur, PAS dans le navigateur
// Créez un serveur proxy pour sécuriser vos requêtes Appwrite

const express = require('express');
const { Client, Account, Users } = require('node-appwrite');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialisation du client Appwrite avec la clé API depuis les variables d'environnement
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const account = new Account(client);
const users = new Users(client);

// Exemple de route pour créer un compte utilisateur
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Création de l'utilisateur via l'API server-side avec ID unique
        const { ID } = require('node-appwrite');
        const user = await users.create(
            ID.unique(),
            email,
            password,
            name
        );
        
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Autres routes sécurisées...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur proxy Appwrite démarré sur le port ${PORT}`);
});
