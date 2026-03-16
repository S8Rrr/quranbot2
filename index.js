const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// لما البوت يشتغل
client.once('ready', () => {
  console.log('Quran Bot is Ready!');
});

// أمر /quran
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'quran') {
    // يتأكد المستخدم داخل روم صوتي
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('You need to join a voice channel first!');

    // قائمة اختيار القارئ
    const menu = new StringSelectMenuBuilder()
      .setCustomId('reciter')
      .setPlaceholder('Choose a reciter')
      .addOptions([
        { label: 'Alafasy', value: 'afasy' },
        { label: 'Abdulbasit', value: 'basit' },
        { label: 'Sudais', value: 'sudais' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: 'Choose a reciter:',
      components: [row]
    });

    // توصيل الصوت
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    // رابط تجريبي للقرآن، ممكن تغييره حسب القارئ والسورة لاحقاً
    const resource = createAudioResource('https://server7.mp3quran.net/afs/001.mp3');

    player.play(resource);
    connection.subscribe(player);
  }
});

client.login(process.env.TOKEN);
