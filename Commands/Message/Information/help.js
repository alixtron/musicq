const {
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  aliases: ["h", "cmds", "commands"],
  description: `help menu`,
  userPermissions: [],
  botPermissions: ["EMBED_LINKS"],
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code

    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allcommands = client.mcommands.size;
    let allguilds = client.guilds.cache.size;
    let botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;

    let raw = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setCustomId("help-menu")
        .setPlaceholder(`Click baray didan hame cmd ha`)
        .addOptions([
          {
            label: `Home`,
            value: "home",
            emoji: `🏘️`,
            description: `Click to Go On HomePage`,
          },
          client.mcategories.map((cat) => {
            return {
              label: `${cat.toLocaleUpperCase()}`,
              value: cat,
              emoji: emoji[cat],
              description: `Click to See Commands of ${cat}`,
            };
          }),
        ]),
    ]);

    let help_embed = new MessageEmbed()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(
        `** tn family bot  **`
      )
      .addField(
        `Stats`,
        `>>> ** :gear: \`${allcommands}\` Commands \n :file_folder: \`${allguilds}\` Guilds \n  \n 🏓 \`${client.ws.ping}\` Ping \n  Made by [\` alixtron \`](https://discord.gg/qagQXgwW2Q) **`
      )
      .setFooter(client.getFooter(message.author));

    let main_msg = await message.reply({
      embeds: [help_embed],
      components: [raw],
    });

    let filter = (i) => i.user.id === message.author.id;
    let colector = await main_msg.createMessageComponentCollector({
      filter: filter,
      time: 20000,
    });
    colector.on("collect", async (i) => {
      if (i.isSelectMenu()) {
        await i.deferUpdate().catch((e) => {});
        if (i.customId === "help-menu") {
          let [directory] = i.values;
          if (directory == "home") {
            main_msg.edit({ embeds: [help_embed] }).catch((e) => {});
          } else {
            main_msg
              .edit({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setTitle(
                      `${emoji[directory]} ${directory} Commands ${emoji[directory]}`
                    )
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setDescription(
                      `>>> ${client.mcommands
                        .filter((cmd) => cmd.category === directory)
                        .map((cmd) => {
                          return `\`${cmd.name}\``;
                        })
                        .join(" ' ")}`
                    )
                    .setFooter(client.getFooter(message.author)),
                ],
              })
              .catch((e) => null);
          }
        }
      }
    });

    colector.on("end", async (c, i) => {
      raw.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [raw] }).catch((e) => {});
    });
  },
};
