const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises; // Dosya işlemlerini asenkron yapmak için

// Veri dosyasının yolu
const DATA_FILE = './data/timed_roles.json';

// Veri okuma fonksiyonu
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Dosya yoksa boş bir obje döndür
            return {};
        }
        console.error('Veri dosyası okunamadı:', error);
        return {};
    }
}

// Veri yazma fonksiyonu
async function writeData(data) {
    try {
        await fs.mkdir('./data', { recursive: true }); // Klasör yoksa oluştur
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Veri dosyası yazılamadı:', error);
    }
}

// Rolü kaldırma fonksiyonu
async function removeRole(guild, userId, roleId, logChannel) {
    try {
        const member = await guild.members.fetch(userId);
        const role = guild.roles.cache.get(roleId);

        if (member && member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);

            const unbanEmbed = new EmbedBuilder()
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor('#00FF00')
                .setTitle('MED II')
                .setDescription(`${member} kişisinden ${role} rolü geri alındı.`);

            if (logChannel) {
                logChannel.send({ embeds: [unbanEmbed] });
            }
        }
    } catch (error) {
        console.error('Rol kaldırma hatası:', error);
    }
    // İşlem bittikten sonra veriden kaldır
    const data = await readData();
    delete data[userId];
    await writeData(data);
}

module.exports = {
    name: "çyasak",
    description: "Kullanıcıya 1 haftalık çekiliş yasağı rolü verir.",
    args: true,
    usage: "@kullanıcı",
    data: new SlashCommandBuilder()
        .setName('cekilis-yasak')
        .setDescription('Belirtilen kullanıcıya 1 haftalık çekiliş yasağı rolü verir.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Rolün verileceği kullanıcı.')
                .setRequired(true)),

    async execute(client, message, args) {
        const targetMember = message.mentions.members.first();
        if (!targetMember) return message.reply("`Bir kullanıcı etiketlemelisin.`");
        await this.runCommand(client, message, message.member, targetMember);
    },

    async executeSlash(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const targetMember = interaction.options.getMember('kullanıcı');
        if (!targetMember) return interaction.editReply({ content: '`Belirtilen kullanıcı bulunamadı.`', ephemeral: true });
        await this.runCommand(client, interaction, interaction.member, targetMember);
    },

    async runCommand(client, interactionOrMessage, authorMember, targetMember) {
        const allowedRoleID = "1238598132745506856";
        const roleToGive = "1248173827196715100";
        const logChannelID = "1251072813524320330";
        const guild = authorMember.guild;
        const logChannel = guild.channels.cache.get(logChannelID);

        if (!authorMember || !authorMember.roles.cache.has(allowedRoleID)) {
            const replyContent = "`Bu komutu kullanma yetkiniz bulunmamaktadır.`";
            return (interactionOrMessage.replied || interactionOrMessage.deferred) ? 
                interactionOrMessage.editReply({ content: replyContent, ephemeral: true }) :
                interactionOrMessage.reply(replyContent);
        }

        const role = guild.roles.cache.get(roleToGive);
        if (!role) {
            const replyContent = `\`ID'si ${roleToGive} olan rol bulunamadı.\``;
            return (interactionOrMessage.replied || interactionOrMessage.deferred) ?
                interactionOrMessage.editReply({ content: replyContent, ephemeral: true }) :
                interactionOrMessage.reply(replyContent);
        }

        // Rolü ver
        await targetMember.roles.add(roleToGive);

        const embed = new EmbedBuilder()
            .setAuthor({ name: authorMember.user.tag, iconURL: authorMember.user.displayAvatarURL() })
            .setColor('#FF0000')
            .setTitle('MED II')
            .setDescription(`${targetMember} kişisine **1 haftalık** ${role} rolü verildi.`)
            .setFooter({ text: 'Lütfen şartı gerçekleştirmeden çekilişlere katılmayalım 💖' });

        await interactionOrMessage.channel.send({ embeds: [embed] });
        if (interactionOrMessage.replied || interactionOrMessage.deferred) await interactionOrMessage.deleteReply().catch(() => {});
        if (logChannel) await logChannel.send({ embeds: [embed] });

        // Veriyi kaydet
        const data = await readData();
        const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
        data[targetMember.id] = {
            guildId: guild.id,
            roleId: roleToGive,
            endTime: expirationTime
        };
        await writeData(data);

        // Kalan süre için setTimeout ayarla
        const remainingTime = expirationTime - Date.now();
        setTimeout(async () => {
            await removeRole(guild, targetMember.id, roleToGive, logChannel);
        }, remainingTime);
    },

    // Bot her açıldığında kontrolü yapacak fonksiyon
    async startupCheck(client) {
        const data = await readData();
        for (const userId in data) {
            const entry = data[userId];
            const remainingTime = entry.endTime - Date.now();

            const guild = client.guilds.cache.get(entry.guildId);
            const logChannel = guild ? guild.channels.cache.get(logChannelID) : null;

            if (remainingTime <= 0) {
                // Süre dolmuşsa hemen kaldır
                await removeRole(guild, userId, entry.roleId, logChannel);
            } else {
                // Süre kalmışsa yeni setTimeout kur
                setTimeout(async () => {
                    await removeRole(guild, userId, entry.roleId, logChannel);
                }, remainingTime);
            }
        }
    }
};
