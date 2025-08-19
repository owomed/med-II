const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Hem prefix hem de slash komutları için tanımlamalar
    name: 'etkinlik',
    aliases: ['Etkinlik'],
    description: 'Belirli kanallarda Etkinlik Katılımcısı rolünü etiketler.',

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('etkinlik')
        .setDescription('Belirli kanallarda Etkinlik Katılımcısı rolünü etiketler.'),

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message) {
        // Fonksiyonel kodun tamamı burada
        await this.runCommand(message.channel, message.member, message);
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        // Fonksiyonel kodun tamamı burada
        // Yanıt verilirken etkileşim kullanıldığı için interaction.reply() gerekli
        await interaction.deferReply({ ephemeral: true }); // Kullanıcının komutu kullandığını belirtir
        await this.runCommand(interaction.channel, interaction.member, interaction);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(channel, member, interactionOrMessage) {
        const allowedChannelIDs = ['1238045814388035651', '1238045899360309289'];
        const allowedRoleID = '1238598537948954824';
        const mentionRoleID = '1238180102454513845';

        // Kanal ve kullanıcı yetki kontrolü
        if (!allowedChannelIDs.includes(channel.id)) {
            const replyContent = '`Bu komut bu kanalda kullanılamaz.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply(replyContent);
            }
            return await interactionOrMessage.reply(replyContent);
        }

        if (!member || !member.roles.cache.has(allowedRoleID)) {
            const replyContent = '`Bu komutu kullanma yetkiniz bulunmamaktadır.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply(replyContent);
            }
            return await interactionOrMessage.reply(replyContent);
        }

        // Prefix komutu ise mesajı sil
        if (interactionOrMessage.type !== 2) { // Etkileşim türü 2 (APPLICATION_COMMAND) değilse
            await interactionOrMessage.delete().catch(() => {});
        }

        // Rolü etiketleyen mesajı gönder
        await channel.send(`<@&${mentionRoleID}>`);

        // Slash komutu ise yanıtı düzenle (eğer deferReply kullanıldıysa)
        if (interactionOrMessage.replied || interactionOrMessage.deferred) {
            await interactionOrMessage.deleteReply().catch(() => {});
        }
    }
};
