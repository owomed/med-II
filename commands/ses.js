const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: "2ses",
    aliases: ['sese-gir', 'join-voice'],
    description: "Botu belirli bir ses kanalına bağlar.",
    usage: "<kanal ID'si>",

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('ses')
        .setDescription('Botu belirtilen ses kanalına bağlar.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Botun katılacağı ses kanalı.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)),

    // Prefix komutu için ana işlev (messageCreate)
    async execute(client, message, args) {
        const voiceChannelId = args[0] || '1235643294973956158'; // Eğer argüman yoksa varsayılan ID'yi kullan
        const voiceChannel = message.guild.channels.cache.get(voiceChannelId);

        if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
            return message.reply('`Belirtilen ID geçerli bir ses kanalı ID’si değil.`');
        }

        await this.runCommand(voiceChannel, message, message.member);
    },

    // Slash komutu için ana işlev (interactionCreate)
    async executeSlash(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const voiceChannel = interaction.options.getChannel('kanal');
        await this.runCommand(voiceChannel, interaction, interaction.member);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(voiceChannel, interactionOrMessage, authorMember) {
        // Yetki kontrolü
        if (!authorMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const replyContent = '`Bu komutu kullanma yetkiniz bulunmamaktadır.`';
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                return await interactionOrMessage.editReply({ content: replyContent, ephemeral: true });
            }
            return await interactionOrMessage.reply(replyContent);
        }

        try {
            // Ses kanalına bağlan
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: false // İsteğe bağlı, botun kendi kendini sağır yapmasını engeller
            });
            
            const replyContent = `<#${voiceChannel.id}> kanalına başarıyla katıldım.`;
            
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                await interactionOrMessage.editReply({ content: replyContent, ephemeral: false });
            } else {
                await interactionOrMessage.reply(replyContent);
            }
            
        } catch (error) {
            console.error('Ses kanalına katılırken bir hata oluştu:', error);
            const errorContent = '`Ses kanalına katılırken bir sorun oluştu.`';
            
            if (interactionOrMessage.replied || interactionOrMessage.deferred) {
                await interactionOrMessage.editReply({ content: errorContent, ephemeral: true });
            } else {
                await interactionOrMessage.reply(errorContent);
            }
        }
    }
};
