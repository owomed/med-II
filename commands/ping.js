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
        // Asıl mantığı içeren ortak fonksiyona yönlendirme
        await this.runCommand(client, message, message);
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        // Komutun çalıştığını belirten geçici bir yanıt gönderir
        await interaction.deferReply();

        // Asıl mantığı içeren ortak fonksiyona yönlendirme
        await this.runCommand(client, interaction, interaction);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(client, interactionOrMessage, replyTarget) {
        // Ping mesajının başlangıcını gönderin
        const startTimestamp = Date.now();
        const sentMessage = await replyTarget.reply('`Ping hesaplanıyor...`');
        
        const ping = sentMessage.createdTimestamp - startTimestamp;
        const apiPing = Math.round(client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .setDescription(`Botun gecikmesi: **${ping}ms**\nAPI gecikmesi: **${apiPing}ms**`)
            .setColor('#00ff00')
            .setTimestamp();
        
        if (replyTarget.deferred) { // Slash komutu ise
            await replyTarget.editReply({ content: '', embeds: [embed] });
        } else { // Prefix komutu ise
            await sentMessage.edit({ content: '', embeds: [embed] });
        }
    }
};
