const Discord = require('discord.js');

module.exports = {
    name: 'kilit',
    description: 'Belirli kanalları kilitler veya kilidi açar.',
    async execute(client, message, args) {
        const çekilişChannelIDs = ['1238416744050065448'];
        const etkinlikChannelIDs = ['1238045899360309289', '1277593114269454396', '1277593211363262546', '1277593298047078460'];        
        const etkinlikRole = ['1238598537948954824'];
        const çekilişRole = ['1238598132745506856'];
        const logChannelId = '833691259222360165';

        const currentChannel = message.channel;
        const everyoneRole = message.guild.roles.everyone;

        // Etkinlik kanalıysa sadece etkinlik rolü kullanabilir
        if (etkinlikChannelIDs.includes(currentChannel.id)) {
            const hasPermission = message.member.roles.cache.some(role => etkinlikRole.includes(role.id));
            if (!hasPermission) {
                return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
            }
        }
        // Çekiliş kanalıysa sadece çekiliş rolü kullanabilir
        else if (çekilişChannelIDs.includes(currentChannel.id)) {
            const hasPermission = message.member.roles.cache.some(role => çekilişRole.includes(role.id));
            if (!hasPermission) {
                return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
            }
        }
        // Diğer kanallarda kullanılamaz
        else {
            return message.reply('`Bu komut bu kanalda kullanılamaz.`');
        }

        const isLocked = !currentChannel.permissionsFor(everyoneRole).has('SEND_MESSAGES');

        try {
            if (isLocked) {
                await currentChannel.updateOverwrite(everyoneRole, { SEND_MESSAGES: true });

                message.channel.send(`${currentChannel} kanalı başarıyla açıldı.`);
                message.react('<:med_unlocked:1368176380994523197>');

                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send(`${currentChannel} kanalının kiliti açıldı.`);
                }
            } else {
                await currentChannel.updateOverwrite(everyoneRole, { SEND_MESSAGES: false });

                message.channel.send(`${currentChannel} kanalı başarıyla kilitlendi.`);
                message.react('<:med_lock:1368176445804777536>');

                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send(`${currentChannel} kanalı kilitlendi.`);
                }
            }
        } catch (error) {
            console.error('Kanal kilitleme/kilidi açma hatası:', error);
            message.reply('`Kanal kilitlenirken veya kilidi açılırken bir hata oluştu.`');
        }
    },
};
