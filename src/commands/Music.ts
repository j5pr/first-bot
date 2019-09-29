import { Message } from 'discord.js'
import yt from 'ytdl-core'

import { Args, Category, Client, Command, Elevation, Embed, flag } from '../model'

export default new class Music extends Command {
  public name: string = 'music'
  public aliases: string[] = [ 'm' ]
  public category: Category = Category.MEDIA

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description: string = 'Audio.mp4'
  public usage: string = 'music [play|queue|skip] [...options]'

  public options = [
    { ...flag, name: 'join', description: 'Get the bot to join your channel', alias: 'j' },
    { ...flag, name: 'leave', description: 'Get the bot to leave it\'s current channel', alias: 'l' },
    { ...flag, name: 'clear', description: 'Clear the current queue', alias: 'c' }
  ]

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args.join) {
      await this.join(client, message)
    } else if (args.leave) {
      return void await this.leave(client, message)
    } else if (args.clear) {
      return void await this.clear(client, message)
    }

    if (!args.join && args._.length < 1) {
      return void this.args(message)
    } else if (args.join && args._.length < 1) {
      return
    }

    const action = (args._.shift() as string).toLowerCase()

    if (action === 'play') {
      if (args._.length < 1) {
        await this.args(message)
      } else {
        await this.play(client, message, args._.join())
      }
    } else if (action === 'queue') {
      if (args._.length !== 0) {
        await this.args(message)
      } else {
        await this.queue(client, message)
      }
    } else if (action === 'skip') {
      if (args._.length !== 0) {
        await this.args(message)
      } else {
        await this.skip(client, message)
      }
    } else {
      await message.channel.send({ embed: Embed.error('Unknown operation', message.author) })
    }
  }

  private async join(client: Client, message: Message): Promise<void> {
    const { author } = message

    if (client.voiceConnections.has(message.guild.id) && client.music.has(message.guild.id)) {
      return void message.channel.send({ embed: Embed.error('I\'m already connected to a channel!', author) })
    }

    const channel = message.member.voiceChannel

    if (!channel) {
      return void message.channel.send({ embed: Embed.error('You must be in a voice channel!', author) })
    }

    if (!channel.joinable || !channel.speakable) {
      return void message.channel.send({ embed: Embed.error('I must have permissions [CONNECT] and [SPEAK] in this channel!', author) })
    }

    let connection
    try {
      connection = await channel.join()
    } catch (e) {
      return void message.channel.send({ embed: Embed.error(e.toString(), author) })
    }

    connection.on('disconnect', () => void client.music.delete(message.guild.id))

    client.music.set(message.guild.id, {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: connection,
      volume: 5,
      playing: false,
      queue: []
    })
  }

  private async leave(client: Client, message: Message): Promise<void> {
    const { author } = message

    if (!client.voiceConnections.has(message.guild.id)) {
      return void message.channel.send({ embed: Embed.error('I\'m not connected to a channel!', author) })
    }

    const info = client.music.get(message.guild.id) as Client.Guild.Music

    await info.connection.disconnect()
  }

  private async play(client: Client, message: Message, query: string): Promise<void> {
    const { author } = message

    if (!client.voiceConnections.has(message.guild.id)) {
      return void await message.channel.send({ embed: Embed.error('I\'m not connected to a channel!', author) })
    }

    const info = client.music.get(message.guild.id) as Client.Guild.Music

    let songInfo
    try {
      songInfo = await yt.getInfo(query)
    } catch (e) {
      return void message.channel.send(Embed.error(e.toString(), author))
    }

    const song = {
      title: songInfo.title,
      author: songInfo.author.name,
      url: songInfo.video_url
    }

    info.queue.push(song)

    if (info.queue.length === 1 && !info.playing) {
      this.playNext(client, info)
    } else {
      await message.channel.send({ embed: Embed.info().addField('Music', `"${song.title}" by ${song.author} has been added to the queue! (Position: ${info.queue.length})`) })
    }
  }

  private async playNext(client: Client, info: Client.Guild.Music): Promise<void> {
    if (info.queue.length === 0) {
      info.playing = false

      return void await info.textChannel.send({ embed: Embed.info().addField('Music', `The queue is now empty.`) })
    }

    info.playing = true

    const song = info.queue.shift() as Client.Guild.Music.Song

    const left = info.queue.length

    await info.textChannel.send({
      embed: Embed.info()
        .addField('Music', `Now playing... "${song.title}" by ${song.author}.`)
        .addField('Link', song.url)
        .addField('Queue', `There ${left === 1 ? 'is' : 'are'} ${left === 0 ? 'no' : (left === 1 ? 'one' : info.queue.length)} song${left === 1 ? '' : 's'} left in the queue.`)
    })

    const dispatcher = info.connection.playStream(yt(song.url))
      .on('end', () => {
        this.playNext(client, info)
      })
      .on('error', (e) => {
        info.textChannel.send({ embed: Embed.error(e.toString()) })

        info.connection.disconnect()
      })

    dispatcher.setVolumeLogarithmic(info.volume / 5)
  }

  private async clear(client: Client, message: Message): Promise<void> {
    const { author } = message

    if (!client.voiceConnections.has(message.guild.id)) {
      return void await message.channel.send({ embed: Embed.error('I\'m not connected to a channel!', author) })
    }

    const info = client.music.get(message.guild.id) as Client.Guild.Music

    info.queue = []
    info.connection.dispatcher.end()
  }

  private async queue(client: Client, message: Message): Promise<void> {
    const { author } = message

    if (!client.voiceConnections.has(message.guild.id)) {
      return void await message.channel.send({ embed: Embed.error('I\'m not connected to a channel!', author) })
    }

    const info = client.music.get(message.guild.id) as Client.Guild.Music

    const embed = Embed.info()
    let songs = []

    for (let song of info.queue) {
      songs.push(`"${song.title}" by ${song.author}`)
    }

    await message.channel.send({
      embed: embed
        .addField('Queue', songs.join('\n') === '' ? '*None*' : songs.join('\n'))
    })
  }

  private async skip(client: Client, message: Message): Promise<void> {
    if (!client.voiceConnections.has(message.guild.id)) {
      return void await message.channel.send({ embed: Embed.error('I\'m not connected to a channel!', message.author) })
    }

    const info = client.music.get(message.guild.id) as Client.Guild.Music

    info.connection.dispatcher.end()
  }
}
