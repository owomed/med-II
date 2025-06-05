module.exports = {
    name: 'çekiliş',
    aliases: ['Çekiliş'],
    description: 'Belirli kanallarda Çekiliş Katılımcısı rolünü etiketler.',
    async execute(client, message, args) {
        const allowedRoleIDs = ['1238598132745506856', '1188422639845396500']; // Komutu kullanabilecek rollerin ID'leri
        const mentionRoleID = '1238180308608749689'; // Etiketlenecek rol ID'si
        const allowedChannels = ['1238418256490926100', '1238045966708248646', '1238416293892194416']; // İzin verilen kanal ID'leri

        // Kullanıcının gerekli rollerden birine sahip olup olmadığını kontrol edin
        if (!message.member || !message.member.roles.cache.some(role => allowedRoleIDs.includes(role.id))) {
            return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        // Komutun sadece izin verilen kanallarda kullanılıp kullanılmadığını kontrol edin
        if (!allowedChannels.includes(message.channel.id)) {
            return message.reply('`Bu komut bu kanalda kullanılamaz.`');
        }

        // Komut mesajını sil
        await message.delete().catch(() => {}); // Hata olması durumunda crash olmaması için

        // Etiketleme mesajını gönder
        return message.channel.send(`<@&${mentionRoleID}>`);
    },
};
