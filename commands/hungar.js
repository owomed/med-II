const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: 'hg',
    aliases: ['hunger', 'Hunger'],
    description: 'Belli bir kanalda Hunger Games rolünü etiketler.',

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('hg')
        .setDescription('Belli bir kanalda Hunger Games rolünü etiketler.'),

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message) {
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
        const allowedChannelsID = ['1241666402176204851', '1238045814388035651'];
        const allowedRoleID = '1238598537948954824';
        const mentionRoleID = '1242016385689980928';

        // Kanal ve kullanıcı yetki kontrolü
        if (!allowedChannelsID.includes(channel.id)) {
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

        // Etiketlenecek rolü etiketleyen mesajı gönder
        await channel.send(`<@&${mentionRoleID}>`);

        // Slash komutu ise yanıtı sil (deferReply kullanıldıysa)
        if (interactionOrMessage.replied || interactionOrMessage.deferred) {
            await interactionOrMessage.deleteReply().catch(() => {});
        }
    }
};
