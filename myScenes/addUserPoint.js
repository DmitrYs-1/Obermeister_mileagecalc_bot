const { Scenes, Markup } = require('telegraf');
const config = require('../config')
const db = require('../db');
const {checkReg, checkObject} = require('../functions')

const addUserPoint = new Scenes.BaseScene('addUserPoint')
addUserPoint.enter(async (ctx)=>{
    let keyboard = Markup.keyboard([['Назад']]).resize()
    await ctx.replyWithHTML("Для добавления нового адреса отправь геопозицию нужного места", keyboard)
})

addUserPoint.start(async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return
    }else{        
        ctx.reply(config.msgTexts.botReady, config.msgBtns.myPoints) 
        ctx.scene.leave()
    }
})

addUserPoint.on('location', async (ctx)=>{
    ctx.session.coords = ctx.message.location.latitude+','+ctx.message.location.longitude
    ctx.scene.enter('addUserPointStep2')
})

addUserPoint.hears(/^Назад$/, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.scene.enter('userPoints')
})

addUserPoint.on('message', async (ctx)=>{
    ctx.scene.reenter()
})

module.exports = addUserPoint