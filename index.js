const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');
require('dotenv').config();

const app = express();
const port = 3000;

// --- Petit serveur pour Render (évite que ça s’arrête)
app.get('/', (req, res) => {
  res.send('🤖 Bot Discord actif !');
});
app.listen(port, () => {
  console.log(`🌐 Serveur web actif sur http://localhost:${port}`);
});

// --- Ton token
const TOKEN = process.env.TOKEN;

// === Liens entre salons Discord et Google Script
const scriptMap = {
  // ID_SALON_DISCORD : 'URL_GOOGLE_SCRIPT'
  '123456789012345678': 'https://script.google.com/macros/s/ABC123/exec',
  '987654321098765432': 'https://script.google.com/macros/s/XYZ789/exec'
  // Ajoute autant que tu veux ici
};

// === Création du bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// === Événement : quand un message est envoyé
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const scriptURL = scriptMap[message.channel.id];

  if (message.content === '!reset' && scriptURL) {
    try {
      await axios.post(scriptURL, {
        content: '!reset',
        author: message.author.username
      });
      message.reply('🔁 Script RESET lancé pour ce salon !');
    } catch (error) {
      console.error('❌ Erreur lors de l’appel du script :', error);
      message.reply('⚠️ Erreur pendant l’exécution du script.');
    }
  }
});

// === Connexion à Discord
client.login(TOKEN);
