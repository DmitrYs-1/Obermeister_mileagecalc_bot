const { Scenes, Markup } = require('telegraf');
const config = require('../config')
const db = require('../db');
const {checkReg, checkObject} = require('../functions')

const userPoints = new Scenes.BaseScene('userPoints')
userPoints.enter(async (ctx)=>{
    let points = await db.query("SELECT * FROM `user_objects` WHERE `chat_id` = ?", [ctx.message.chat.id])
    let text = "<b>Ваши адреса:</b>\r\n"
    if(points.length == 0){
        text += "Нет сохранённых адресов"
    }else{
        for(p of points){
            text += p['name']+" - "+p['comment']+" /del_"+p['id']+"\r\n"
        }
    }
    let keyboard = Markup.keyboard([['Добавить адрес'],['Назад']]).resize()
    await ctx.replyWithHTML(text, keyboard)
})

userPoints.hears(/^Добавить адрес$/, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.scene.enter('addUserPoint')
})

userPoints.hears(/^\/del_\d{1,}$/, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    let pointId = ctx.message.text.match(/^\/del_(\d{1,})$/)
    let point = await db.query("SELECT `comment` FROM `user_objects` WHERE `id` = ? AND `chat_id` = ?", [pointId[1], ctx.message.chat.id])
    if(point.length > 0){
        await db.query("DELETE FROM `user_objects` WHERE `id` = ? AND `chat_id` = ?", [pointId[1], ctx.message.chat.id])
        ctx.reply("Адрес \""+point[0]['comment']+"\" удалён")
        ctx.scene.reenter()
    }else{
        ctx.reply("Произошла ошибка. Попробуй ещё раз")
        ctx.scene.reenter()
    }    
})

userPoints.hears(/^Назад$/, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.reply(config.msgTexts.botReady, config.msgBtns.myPoints)
    ctx.scene.leave()
})

userPoints.on('message', async (ctx)=>{
    return
})

module.exports = userPoints