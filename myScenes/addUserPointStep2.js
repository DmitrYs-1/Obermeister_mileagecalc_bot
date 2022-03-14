const { Scenes, Markup } = require('telegraf');
const config = require('../config')
const db = require('../db');
const {checkReg, checkObject} = require('../functions')

const addUserPointStep2 = new Scenes.BaseScene('addUserPointStep2')
addUserPointStep2.enter(async (ctx)=>{
    let keyboard = Markup.keyboard([['Назад']]).resize()
    await ctx.replyWithHTML("Напиши комментарий к адресу. Его будешь видеть только ты", keyboard)
})

addUserPointStep2.on('text', async (ctx)=>{
    let points = await db.query("SELECT COUNT(id) FROM `user_objects` WHERE `chat_id` = ?", [ctx.message.chat.id])
    //console.log(points)
    let no = Number(points[0]['COUNT(id)'])+1
    let name = 'my'+no
    db.query("INSERT INTO `user_objects` (`chat_id`, `name`, `comment`, `coords`) VALUE (?, ?, ?, ?)", [ctx.message.chat.id, name, ctx.message.text, ctx.session.coords])
    await ctx.replyWithHTML(`Точка ${name} - ${ctx.message.text} успешно сохранена`)
    ctx.scene.enter('userPoints')
})

addUserPointStep2.hears(/^Назад$/, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.scene.enter('userPoints')
})

addUserPointStep2.on('message', async (ctx)=>{
    ctx.scene.reenter()
})

module.exports = addUserPointStep2