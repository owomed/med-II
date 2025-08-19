const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: 'market',
    aliases: ['Market'],
    description: 'Belirli bir kanalda Market öneri rolünü etiketler.',

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('market')
        .setDescription('Belirli bir kanalda Market öneri rolünü etiketler.'),

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message, args) {
        // Asıl mantığı içeren ortak fonksiyona yönlendirme
        await this.runCommand(message.channel, message.member, message);
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        // Komutun çalıştığını belirten geçici bir yanıt gönderir
        await interaction.deferReply({ ephemeral: true });

        // Asıl mantığı içeren ortak fonksiyona yönlendirme
        await this.runCommand(interaction.channel, interaction.member, interaction);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(channel, member, interactionOrMessage) {
        const allowedChannelIDs = ['1245296223091687535', '1238045899360309289'];
        const allowedRoleID = '1251611432706113606';
        const mentionRoleID = '1238183161188581447';

        // Kanal ve kullanıcı yetki kontrolü
        if (!allowedChannelIDs.includes(channel.id)) {
            const replyContent = '`Bu komut bu kanalda kullanılamaz.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        if (!member || !member.roles.cache.has(allowedRoleID)) {
            const replyContent = '`Bu komutu kullanma yetkiniz bulunmamaktadır.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        // Rolü etiketleyen mesajı gönder
        await channel.send(`<@&${mentionRoleID}>`);

        // Slash komutu ise geçici yanıtı sil
        if (interactionOrMessage.replied || interactionOrMessage.deferred) {
            await interactionOrMessage.deleteReply().catch(() => {});
        }
    }
};
