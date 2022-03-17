const { Scenes, Markup } = require('telegraf');
const config = require('../config')
const db = require('../db');

const passw = new Scenes.BaseScene('passw')
passw.enter(async (ctx)=>{
    await ctx.reply("Для использования бота укажи пароль")
})

passw.on('text', async (ctx)=>{
    if(ctx.message.text == config.system.botPassword){
        let name = ''
        if(ctx.message.chat.username){
            name = ctx.message.chat.username
        }else if(ctx.message.chat.first_name){
            name = ctx.message.chat.first_name
        }else{
            name = 'noname'
        }
        db.query("INSERT INTO `users` (`chat_id`, `user_name`, `region`) VALUES (?, ?, '')", [ctx.message.chat.id, name])

        ctx.scene.enter('passw2')
    }else{
        ctx.scene.reenter()
    }
})

passw.on('message', async (ctx)=>{
    ctx.reply('Пароль должен быть текстом!')
})

module.exports = passw