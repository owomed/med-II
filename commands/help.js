const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    // Prefix komutu için tanımlamalar
    name: '2help',
    aliases: ['2yardım'],
    description: "Tüm komutların listesini ve bunların nasıl kullanılacağını gösterir.",

    // Slash komutu için özel veri yapısı
    data: new SlashCommandBuilder()
        .setName('2help')
        .setDescription('Tüm komutların listesini ve bunların nasıl kullanılacağını gösterir.'),

    // Prefix komutu için ana işlev
    async execute(client, message, args) {
        // Asıl mantığı içeren ortak fonksiyona yönlendirme
        await this.runCommand(client, message.channel, message);
    },

    // Slash komutu için ana işlev
    async executeSlash(client, interaction) {
        // Komutun çalıştığını belirten geçici bir yanıt gönderir
        await interaction.deferReply({ ephemeral: true });

        // Asıl mantığı içeren ortak fonksiyona yönlendirme
        await this.runCommand(client, interaction.channel, interaction);
    },

    // Prefix ve Slash komutlarında ortak çalışacak ana mantık
    async runCommand(client, channel, interactionOrMessage) {
        // `client.commands` koleksiyonu yalnızca prefix komutlarını içeriyorsa
        const commands = client.commands.map(command => ({
            name: command.name,
            description: command.description,
            usage: command.usage ? command.usage : ""
        }));
        
        // Eğer slash komutlarını da dahil etmek isterseniz bu kısmı kullanın
        /*
        const commands = [...client.commands.values(), ...client.slashCommands.values()].map(command => ({
            name: command.name,
            description: command.description,
            usage: command.usage ? command.usage : `/${command.name}` // Slash komutları için kullanım
        }));
        */

        const embed = new EmbedBuilder()
            .setTitle("Yardım Komutları")
            .setColor("#00FF00")
            .setDescription("Aşağıda botun sahip olduğu tüm komutlar ve bunların nasıl kullanılacağı listelenmiştir.");

        commands.forEach(command => {
            embed.addFields({
                name: `**${command.name}**`,
                value: `**Açıklama:** ${command.description}\n**Kullanım:** \`${command.usage}\``,
                inline: false
            });
        });

        embed.setFooter({ text: "Bot komutlarını kullanırken argümanları doğru girdiğinizden emin olun." });

        if (interactionOrMessage.replied || interactionOrMessage.deferred) {
            await interactionOrMessage.editReply({ embeds: [embed] });
        } else {
            await channel.send({ embeds: [embed] });
        }
    }
};
