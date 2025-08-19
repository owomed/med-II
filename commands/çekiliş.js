const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: 'çekiliş',
    aliases: ['Çekiliş'],
    description: 'Belirli kanallarda Çekiliş Katılımcısı rolünü etiketler.',

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('cekilis')
        .setDescription('Belirli kanallarda Çekiliş Katılımcısı rolünü etiketler.'),

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message, args) {
        // Fonksiyonel kodun tamamı burada
        await this.runCommand(message.channel, message.member, message);
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        // Yanıt verilirken etkileşim kullanıldığı için interaction.reply() gerekli
        await interaction.deferReply({ ephemeral: true }); // Kullanıcının komutu kullandığını belirtir
        await this.runCommand(interaction.channel, interaction.member, interaction);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(channel, member, interactionOrMessage) {
        const allowedRoleIDs = ['1238598132745506856', '1188422639845396500']; // Komutu kullanabilecek rollerin ID'leri
        const mentionRoleID = '1238180308608749689'; // Etiketlenecek rol ID'si
        const allowedChannels = ['1238418256490926100', '1238045966708248646', '1238416293892194416', '1399417189756309514']; // İzin verilen kanal ID'leri

        // Kanal ve kullanıcı yetki kontrolü
        if (!allowedChannels.includes(channel.id)) {
            const replyContent = '`Bu komut bu kanalda kullanılamaz.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        if (!member || !member.roles.cache.some(role => allowedRoleIDs.includes(role.id))) {
            const replyContent = '`Bu komutu kullanma yetkiniz bulunmamaktadır.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        // Prefix komutu ise mesajı sil
        if (interactionOrMessage.type !== 2) { // Etkileşim türü 2 (APPLICATION_COMMAND) değilse
            await interactionOrMessage.delete().catch(() => {});
        }

        // Rolü etiketleyen mesajı gönder
        await channel.send(`<@&${mentionRoleID}>`);

        // Slash komutu ise geçici yanıtı sil
        if (interactionOrMessage.replied || interactionOrMessage.deferred) {
            await interactionOrMessage.deleteReply().catch(() => {});
        }
    }
};
