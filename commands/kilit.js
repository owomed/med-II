const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: 'kilit',
    description: 'Belirli kanalları kilitler veya kilidi açar.',

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('kilit')
        .setDescription('Bulunduğunuz kanalı kilitler veya kilidini açar.')
        .setDMPermission(false), // Sadece sunucularda kullanılabilir

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message) {
        // Fonksiyonel kodun tamamı burada
        await this.runCommand(client, message.channel, message.member, message);
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        // Yanıt verilirken etkileşim kullanıldığı için interaction.reply() gerekli
        await interaction.deferReply({ ephemeral: true });
        await this.runCommand(client, interaction.channel, interaction.member, interaction);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(client, currentChannel, member, interactionOrMessage) {
        const çekilişChannelIDs = ['1238416744050065448'];
        const etkinlikChannelIDs = ['1238045899360309289', '1277593114269454396', '1277593211363262546', '1277593298047078460'];
        const ticketBildirimChannelID = '1403041577508540539';
        const etkinlikRole = ['1238598537948954824'];
        const çekilişRole = ['1238598132745506856'];
        const ticketSellerRole = ['1403046566796984342'];
        const logChannelId = '833691259222360165';

        // Kanal yetki kontrolü için izin verilen rollerin listesi
        let hasPermission = false;
        if (etkinlikChannelIDs.includes(currentChannel.id)) {
            hasPermission = member.roles.cache.some(role => etkinlikRole.includes(role.id));
        } else if (çekilişChannelIDs.includes(currentChannel.id)) {
            hasPermission = member.roles.cache.some(role => çekilişRole.includes(role.id));
        } else if (currentChannel.id === ticketBildirimChannelID) {
            hasPermission = member.roles.cache.some(role => ticketSellerRole.includes(role.id));
        } else {
            const replyContent = '`Bu komut bu kanalda kullanılamaz.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        if (!hasPermission) {
            const replyContent = '`Bu komutu kullanma yetkiniz bulunmamaktadır.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        const everyoneRole = currentChannel.guild.roles.everyone;
        const isLocked = !currentChannel.permissionsFor(everyoneRole).has(PermissionsBitField.Flags.SendMessages);

        try {
            if (isLocked) {
                await currentChannel.permissionOverwrites.edit(everyoneRole, {
                    SendMessages: true,
                });

                const logChannel = member.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    await logChannel.send(`${currentChannel} kanalının kilidi açıldı.`);
                }
                
                // Başarılı yanıt
                const replyContent = `${currentChannel} kanalı başarıyla açıldı.`;
                await currentChannel.send(replyContent);
                // Prefix komutuysa emoji ile tepki ver
                if (interactionOrMessage.type !== 2) {
                    await interactionOrMessage.react('1368176380994523197');
                } else {
                    await interactionOrMessage.deleteReply();
                }

            } else {
                await currentChannel.permissionOverwrites.edit(everyoneRole, {
                    SendMessages: false,
                });

                const logChannel = member.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    await logChannel.send(`${currentChannel} kanalı kilitlendi.`);
                }
                
                // Başarılı yanıt
                const replyContent = `${currentChannel} kanalı başarıyla kilitlendi.`;
                await currentChannel.send(replyContent);
                // Prefix komutuysa emoji ile tepki ver
                if (interactionOrMessage.type !== 2) {
                    await interactionOrMessage.react('1368176445804777536');
                } else {
                    await interactionOrMessage.deleteReply();
                }
            }
        } catch (error) {
            console.error('Kanal kilitleme/kilidi açma hatası:', error);
            const replyContent = '`Kanal kilitlenirken veya kilidi açılırken bir hata oluştu.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            } else {
                await interactionOrMessage.reply(replyContent);
            }
        }
    }
};
