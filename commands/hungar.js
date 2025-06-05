module.exports = {
    name: 'hg',
    aliases: ['hunger', 'Hunger'],
    description: 'Belli bir kanalda Hunger Games rolünü etiketler.',
    async execute(client, message, args) {
        // Komutun kullanılabileceği kanalın ID'sini ve rol ID'sini belirtin
        const allowedChannelsID = ['1241666402176204851', '1238045814388035651'];
        const allowedRoleID = '1238598537948954824';
        const mentionRoleID = '1242016385689980928';

        // Komutun kullanıldığı kanal ve kullanıcı rolü kontrolü
        if (!allowedChannelsID.includes(message.channel.id)) {
            return message.reply('`Bu komut bu kanalda kullanılamaz.`');
        }

        if (!message.member.roles.cache.has(allowedRoleID)) {
            return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        // Etiketlenecek rolü etiketleyen mesaj gönderin
        message.channel.send(`<@&${mentionRoleID}>`);
    },
};
  