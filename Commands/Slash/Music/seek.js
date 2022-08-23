const { CommandInteraction } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "seek",
  description: `seek tkardan song az playlist`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  options: [
    {
      name: "amount",
      description: `number song ke mikhay seek koni`,
      type: "NUMBER",
      required: true,
    },
  ],

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let seek = interaction.options.getNumber("amount")
    await queue.seek(seek);
    client.embed(
      interaction,
      `${client.config.emoji.SUCCESS} Seeked \`${seek}\` Seconds !!`
    );
  },
};
