module.exports = {
    name: 'etkinlik',
    aliases: ['Etkinlik'],
    description: 'Belirli kanallarda Etkinlik Katılımcısı rolünü etiketler.',
    async execute(client, message, args) {
        const allowedChannelIDs = ['1238045814388035651', '1238045899360309289'];
        const allowedRoleID = '1238598537948954824';
        const mentionRoleID = '1238180102454513845';

        // Kanallar ve kullanıcı yetkileri kontrolü
        if (!allowedChannelIDs.includes(message.channel.id)) {
            return message.reply('`Bu komut bu kanalda kullanılamaz.`');
        }

        if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
            return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

         await message.delete().catch(() => {}); // Hata olması durumunda crash olmaması için

        // Rolü etiketleyen mesaj gönderme
        message.channel.send(`<@&${mentionRoleID}>`);
    },
};
