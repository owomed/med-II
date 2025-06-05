const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "yb",
  description: "Kullanıcıya Yarım Bilet rolü verir/alır.",
  args: true,
  usage: "@kullanıcı",
  async execute(client, message, args) {
    if (!message.mentions.users.size) {
      return message.reply("Bir kullanıcı etiketlemelisin.");
    }

    const allowedRoleID = "1238576058119487539";
    const roleToCheck = "1246824803885912105"; // Kullanıcının sahip olup olmadığını kontrol edeceğimiz rol ID'si
    const mentionedUser = message.mentions.members.first(); // Etiketlenen kullanıcı
    const guild = message.guild; // Mesajın atıldığı sunucu
    const logChannelID = "1237313546354823218"; // Log mesajının gönderileceği kanal ID'si
    const logChannel = guild.channels.cache.get(logChannelID);

    if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
      return message.reply("Bu komutu kullanma yetkiniz bulunmamaktadır.");
    }

    if (!mentionedUser) {
      return message.reply("Belirtilen kullanıcı bulunamadı.");
    }

    const role = guild.roles.cache.get(roleToCheck);

    if (!role) {
      return message.reply(`ID'si ${roleToCheck} olan rol bulunamadı.`);
    }

    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor('Random');

    if (mentionedUser.roles.cache.has(roleToCheck)) {
      // Kullanıcının rolü varsa al
      await mentionedUser.roles.remove(roleToCheck);
      embed.setDescription(`${mentionedUser} adlı kullanıcıdan ${role} rolü alındı. <a:med_verify2:1242796273480892428>`);
      message.channel.send(embed);

      if (logChannel) {
        logChannel.send(embed);
      }
    } else {
      // Kullanıcının rolü yoksa ver
      await mentionedUser.roles.add(roleToCheck);
      embed.setDescription(`${mentionedUser} adlı kullanıcıya ${role} rolü verildi. <a:med_verify2:1242796273480892428>`);
      message.channel.send(embed);

      if (logChannel) {
        logChannel.send(embed);
      }
    }
  },
};
