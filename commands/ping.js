const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: '2ping',
    description: 'Botun gecikmesini hesaplar.',
    
    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('2ping')
        .setDescription('Botun gecikmesini ve API gecikmesini gösterir.'),

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message) {
        const startTimestamp = Date.now();
        const sentMessage = await message.reply('`Ping hesaplanıyor...`');
        const ping = sentMessage.createdTimestamp - startTimestamp;
        const apiPing = client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .setDescription(`Botun gecikmesi: **${ping}ms**\nAPI gecikmesi: **${apiPing}ms**`)
            .setColor('#00ff00')
            .setTimestamp();
        
        await sentMessage.edit({ content: '', embeds: [embed] });
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        await interaction.deferReply();
        
        const ping = Date.now() - interaction.createdTimestamp;
        const apiPing = client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .setDescription(`Botun gecikmesi: **${ping}ms**\nAPI gecikmesi: **${apiPing}ms**`)
            .setColor('#00ff00')
            .setTimestamp();
            
        await interaction.editReply({ embeds: [embed] });
    }
};
