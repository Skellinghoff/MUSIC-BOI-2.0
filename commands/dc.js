const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dc')
        .setDescription('Disconnect the bot from the voice channel'),
    inVoiceChannel: true,
    inSameVoiceChannel: true,
    inAssignedTextChannel: false,
    detailedDescription: 'Allows a user that is an Admin, Owner, or DJ to disconnect the bot from the voice channel',
    async execute(interaction) {
        await interaction.deferReply();
        // Check if the user has the role Admin, Owner, or DJ
        const member = interaction.member;
        const roles = member.roles.cache;
        const isAdmin = roles.some((role) => role.name === 'ADMINISTRATOR');
        const isOwner = interaction.guild.ownerId === interaction.user.id;
        const isDJ = roles.some((role) => role.name === 'DJ');
        if (!isAdmin && !isOwner && !isDJ) {
            // Create a new embed message with the error message
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You need to be an Admin, Owner, or a DJ to use this command!')
                .setColor('#ff0000');
            return void interaction.followUp({ embeds: [embed] });
        }
        // Check if a voice connection for the bot exists
        const connection = getVoiceConnection(interaction.guild.id);
        if (!connection) {
            // Create a new embed message with the error message
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('The bot is not connected to a voice channel!')
                .setColor('#ff0000');
            return void interaction.followUp({ embeds: [embed] });
        }
        // Check if the connection is in the same voice channel as the user
        if (connection.joinConfig.channelId !== interaction.member.voice.channelId) {
            // Create a new embed message with the error message
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('The bot is not connected to your voice channel!')
                .setColor('#ff0000');
            return void interaction.followUp({ embeds: [embed] });
        }
        // Disconnect the bot from the voice channel
        connection.destroy();
        // Create a new embed message with the success message
        const embed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription('Disconnected the bot from the voice channel!')
            .setColor('#00ff00');
        return void interaction.followUp({ embeds: [embed] });
    }
};
