const { CommandInteraction } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "setupmusic",
  description: `sakhtan music chanle`,
  userPermissions: ["MANAGE_CHANNELS"],
  botPermissions: ["MANAGE_CHANNELS"],
  category: "Settings",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let channel = await client.music.get(
      `${interaction.guild.id}.music.channel`
    );
    let oldChannel = interaction.guild.channels.cache.get(channel);
    if (oldChannel) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} music chanel dar ${oldChannel} sakhte shode delete kon va dobare emtehan kon **`
      );
    } else {
      interaction.guild.channels
        .create(`${client.user.username}-requests`, {
          type: "GUILD_TEXT",
          rateLimitPerUser: 3,
          reason: `for music bot`,
          topic: `Music Request Channel for ${client.user.username}, Type Song Name or Link to Play Song`,
        })
        .then(async (ch) => {
          await ch
            .send({ embeds: [client.queueembed(interaction.guild)] })
            .then(async (queuemsg) => {
              await ch
                .send({
                  embeds: [client.playembed(interaction.guild)],
                  components: [client.buttons(true)],
                })
                .then(async (playmsg) => {
                  await client.music.set(`${interaction.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  client.embed(
                    interaction,
                    `${client.config.emoji.SUCCESS} Successfully Setup Music System in ${ch}`
                  );
                });
            });
        });
    }
  },
};
