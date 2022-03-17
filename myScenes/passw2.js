const { Scenes, Markup } = require('telegraf');
const config = require('../config')
const db = require('../db');

const passw2 = new Scenes.BaseScene('passw2')
passw2.enter(async (ctx)=>{ 
    let groups = await db.query("SELECT * FROM `regions`")
    //console.log(groups)
    var keyboard = []
    for (group of groups){
       keyboard.push(group['name'])
    } 

    keyboard = Markup.keyboard(keyboard).resize()
    await ctx.reply("Выбери свой макрорегион:", keyboard)
})

passw2.on('text', async (ctx)=>{
    
    let groups = await db.query("SELECT * FROM `regions`")
    for (group of groups){
        if(ctx.message.text == group['name']){
            await db.query("UPDATE `users` SET `region` = ? WHERE `chat_id` = ?", [ctx.message.text, ctx.message.chat.id])
            ctx.reply(config.msgTexts.botReady, config.msgBtns.myPoints)
            ctx.scene.leave()
            return
        }
    }
    ctx.scene.reenter()
})

passw2.on('message', async (ctx)=>{
    ctx.scene.reenter()
})

module.exports = passw2