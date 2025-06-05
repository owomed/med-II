const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "2help",
  aliases: ['2yardım'],
  description: "Tüm komutların listesini ve bunların nasıl kullanılacağını gösterir.",
  execute(client, message, args) {
    const commands = client.commands.map(command => ({
      name: command.name,
      description: command.description,
      usage: command.usage ? command.usage : ""
    }));

    let embed = new MessageEmbed()
      .setTitle("Yardım Komutları")
      .setColor("#00FF00")
      .setDescription("Aşağıda botun sahip olduğu tüm komutlar ve bunların nasıl kullanılacağı listelenmiştir.");

    commands.forEach(command => {
      embed.addField(
        `**${command.name}**`,
        `**Açıklama:** ${command.description}\n**Kullanım:** \`${command.usage}\``
      );
    });

    embed.setFooter("Bot komutlarını kullanırken argümanları doğru girdiğinizden emin olun.");

    message.channel.send(embed);
  }
};
