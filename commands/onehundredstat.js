const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: "100stat",
    description: "Kullanıcıya 100 stat rolü verir/alır.",
    args: true, // Prefixten kullanım için
    usage: "@kullanıcı", // Prefixten kullanım için

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('100stat')
        .setDescription('Belirtilen kullanıcıya 100 stat rolü verir veya alır.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Rolün verileceği veya alınacağı kullanıcı.')
                .setRequired(true)), // Zorunlu kullanıcı argümanı

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message, args) {
        const targetMember = message.mentions.members.first();
        if (!targetMember) {
            return message.reply("`Bir kullanıcı etiketlemelisin.`");
        }
        await this.runCommand(client, message, message.member, targetMember);
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const targetMember = interaction.options.getMember('kullanıcı');
        if (!targetMember) {
            return interaction.editReply({ content: '`Belirtilen kullanıcı bulunamadı.`', ephemeral: true });
        }
        await this.runCommand(client, interaction, interaction.member, targetMember);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(client, interactionOrMessage, authorMember, targetMember) {
        const allowedRoleID = "1189127683653783552";
        const roleToCheck = "1270279042515341322";
        const logChannelID = "1237313546354823218";
        const guild = authorMember.guild;
        const logChannel = guild.channels.cache.get(logChannelID);

        // Yetki kontrolü
        if (!authorMember || !authorMember.roles.cache.has(allowedRoleID)) {
            const replyContent = "`Bu komutu kullanma yetkiniz bulunmamaktadır.`";
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        const role = guild.roles.cache.get(roleToCheck);

        if (!role) {
            const replyContent = `\`ID'si ${roleToCheck} olan rol bulunamadı.\``;
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: authorMember.user.tag,
                iconURL: authorMember.user.displayAvatarURL()
            })
            .setColor('Random');

        let replyMessage;

        if (targetMember.roles.cache.has(roleToCheck)) {
            // Kullanıcının rolü varsa al
            await targetMember.roles.remove(roleToCheck);
            replyMessage = `${targetMember} adlı kullanıcıdan ${role} rolü alındı.`;
            embed.setDescription(`${targetMember} adlı kullanıcıdan ${role} rolü alındı. <a:med_verify:1235237448926236763>`);
        } else {
            // Kullanıcının rolü yoksa ver
            await targetMember.roles.add(roleToCheck);
            replyMessage = `${targetMember} adlı kullanıcıya ${role} rolü verildi.`;
            embed.setDescription(`${targetMember} adlı kullanıcıya ${role} rolü verildi. <a:med_verify:1235237448926236763>`);
        }

        // Genel kanala yanıt gönderme
        await interactionOrMessage.channel.send({ content: replyMessage + ' <a:med_verify:1235237448926236763>' });

        // Slash komutunun geçici yanıtını silme
        if (interactionOrMessage.replied || interactionOrMessage.deferred) {
            await interactionOrMessage.deleteReply().catch(() => {});
        }

        // Log kanalına embed gönderme
        if (logChannel) {
            await logChannel.send({ embeds: [embed] });
        }
    },
};
