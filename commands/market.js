module.exports = {
    name: 'market',
    aliases: ['Market'],
    description: 'Belirli bir kanalda Market öneri rolünü etiketler.',
    async execute(client, message, args) {
        const allowedChannelIDs = ['1245296223091687535', '1238045899360309289'];
        const allowedRoleID = '1251611432706113606';
        const mentionRoleID = '1238183161188581447';

        // Kanallar ve kullanıcı yetkileri kontrolü
        if (!allowedChannelIDs.includes(message.channel.id)) {
            return message.reply('`Bu komut bu kanalda kullanılamaz.`');
        }

        if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
            return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        // Rolü etiketleyen mesaj gönderme
        message.channel.send(`<@&${mentionRoleID}>`);
    },
};
