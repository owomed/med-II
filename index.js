const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
require('dotenv').config();

// Config dosyasını yükleyin
const config = require('./Settings/config.json');

// Discord botu için client ve ayarları
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();

// Komut dosyalarını klasörlerden yükleyin
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const stat = fs.statSync(commandsPath); // Dosya mı, klasör mü kontrolü

    if (stat.isDirectory()) { // Eğer klasörse, içindeki dosyaları oku
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command || 'execute' in command) {
                client.commands.set(command.name, command);
                if (command.data) {
                    client.slashCommands.set(command.data.name, command);
                }
            } else {
                console.log(`[UYARI] ${filePath} dosyasında 'data' veya 'execute' eksik.`);
            }
        }
    } else if (stat.isFile() && folder.endsWith('.js')) { // Eğer doğrudan dosyaysa
        const command = require(commandsPath);
        if ('data' in command || 'execute' in command) {
            client.commands.set(command.name, command);
            if (command.data) {
                client.slashCommands.set(command.data.name, command);
            }
        } else {
            console.log(`[UYARI] ${commandsPath} dosyasında 'data' veya 'execute' eksik.`);
        }
    }
}

// Bot hazır olduğunda yapılacaklar
client.once('ready', async () => {
    console.log(`Bot hazır: ${client.user.tag}`);

    // Özel aktiviteyi ayarla
    client.user.setPresence({
        status: 'idle',
        activities: [{
            name: "OwO 💚 MED ile ilgileniyor",
            type: ActivityType.Custom
        }]
    });

    // Ses kanalına katılma işlevi
    const voiceChannelId = '1235643294973956158'; // Ses kanalının ID'si
    const guild = client.guilds.cache.get('1237313545620983808'); // Sunucu ID'si
    if (guild) {
        const voiceChannel = guild.channels.cache.get(voiceChannelId);
        if (voiceChannel && voiceChannel.isVoice()) {
            try {
                const { joinVoiceChannel } = require('@discordjs/voice');
                joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                console.log('Ses kanalına başarıyla katıldı.');
            } catch (error) {
                console.error('Ses kanalına katılırken bir hata oluştu:', error);
            }
        }
    }

    // Zamanlı rol kontrolü
    const çyasakCommand = client.commands.get('çyasak');
    if (çyasakCommand && çyasakCommand.startupCheck) {
        await çyasakCommand.startupCheck(client);
    }
});

// Slash komutlarını dinle
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) {
        console.error(`Komut bulunamadı: ${interaction.commandName}`);
        return;
    }

    try {
        await command.executeSlash(client, interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Bu komutu çalıştırırken bir hata oluştu!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Bu komutu çalıştırırken bir hata oluştu!', ephemeral: true });
        }
    }
});

// Prefix komutlarını dinle
client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error('Komut çalıştırma hatası:', error);
        message.reply('Komut çalıştırılırken bir hata oluştu.');
    }
});

// Express sunucusu
const app = express();
const port = 3000;

app.get('/', (req, res) => res.status(200).send('Çalışma Süresi Botuna Göre Güç'));

app.listen(port, () => {
    console.log(`Express sunucusu port ${port} üzerinde çalışıyor.`);
});

client.login(process.env.TOKEN);
