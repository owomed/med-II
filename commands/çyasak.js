const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "çyasak",
  description: "Kullanıcıya 1 haftalık çekiliş yasağı rolü verir.",
  args: true,
  usage: "@kullanıcı",
  async execute(client, message, args) {
    if (!message.mentions.users.size) {
      return message.reply("Bir kullanıcı etiketlemelisin.");
    }

    const allowedRoleID = "1238598132745506856";
    const roleToGive = "1248173827196715100"; // 1 haftalık rol ID'si
    const logChannelID = "1251072813524320330"; // Log mesajının gönderileceği kanal ID'si
    const mentionedUser = message.mentions.members.first(); // Etiketlenen kullanıcı
    const guild = message.guild; // Mesajın atıldığı sunucu
    const logChannel = guild.channels.cache.get(logChannelID);

    if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
      return message.reply("Bu komutu kullanma yetkiniz bulunmamaktadır.");
    }

    if (!mentionedUser) {
      return message.reply("Belirtilen kullanıcı bulunamadı.");
    }

    const role = guild.roles.cache.get(roleToGive);

    if (!role) {
      return message.reply(`ID'si ${roleToGive} olan rol bulunamadı.`);
    }

    // Rolü ver
    await mentionedUser.roles.add(roleToGive);

    // Embed mesajı oluştur
    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor('#FF0000')
      .setTitle('MED II')
      .setDescription(`${mentionedUser} kişisine **1 haftalık** ${role} rolü verildi.`)
      .setFooter('Lütfen şartı gerçekleştirmeden çekilişlere katılmayalım 💖');

    // Mesajı gönder
    message.channel.send(embed);

    // Log kanalına mesaj gönder
    if (logChannel) {
      logChannel.send(embed);
    }

    // 1 hafta (7 gün) sonra rolü geri al
    setTimeout(async () => {
      if (mentionedUser.roles.cache.has(roleToGive)) {
        await mentionedUser.roles.remove(roleToGive);

        let unbanEmbed = new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor('#00FF00')
          .setTitle('MED II')
          .setDescription(`${mentionedUser} kişisinden ${role} rolü geri alındı.`);

        // Log kanalına mesaj gönder
        if (logChannel) {
          logChannel.send(unbanEmbed);
        }
      }
    }, 7 * 24 * 60 * 60 * 1000); // 1 hafta = 7 gün = 168 saat = 10080 dakika = 604800000 milisaniye
  },
};
