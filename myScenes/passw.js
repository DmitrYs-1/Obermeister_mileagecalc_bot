const { Scenes, Markup } = require('telegraf');
const config = require('../config')
const db = require('../db');

const passw = new Scenes.BaseScene('passw')
passw.enter(async (ctx)=>{
    await ctx.reply("Для использования бота укажи пароль")
})

passw.on('text', async (ctx)=>{
    if(ctx.message.text == config.system.botPassword){
        db.query("INSERT INTO `users` (`chat_id`, `user_name`) VALUES (?, ?)", [ctx.message.chat.id, ctx.message.chat.username])

        let keyboard = Markup.keyboard(['Мои адреса']).resize()

        ctx.reply("Бот готов к работе! Для справки команда /help", keyboard) 
        ctx.scene.leave()
    }else{
        ctx.scene.reenter()
    }
})

passw.on('message', async (ctx)=>{
    ctx.reply('Пароль должен быть текстом!')
})

module.exports = passw