const { Telegraf, Scenes, session, Markup } = require('telegraf');
const fetch = require('node-fetch')
const config = require('./config');
const db = require('./db');
const {checkReg, checkObject} = require('./functions')
const myScens = require('./myScenes')


const bot = new Telegraf(config.system.tgToken)

const stage = new Scenes.Stage([myScens.passw, myScens.userPoints, myScens.addUserPoint, myScens.addUserPointStep2, myScens.passw2, myScens.adm])

bot.use(Telegraf.log())
bot.use(session())
bot.use(stage.middleware())

bot.start(async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return
    }else{        
        ctx.reply(config.msgTexts.botReady, config.msgBtns.myPoints) 
        ctx.scene.leave()
    }
})

bot.help(async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.reply(config.system.helpText, {parse_mode:"HTML", disable_web_page_preview:true}) 
})

bot.command('adm', async (ctx)=>{
    let aid = config.system.adminsid.split(',')
    for(adm of aid){
        if( ctx.message.chat.id == adm){
            ctx.scene.enter('adm')
        }
    }
})

//Расчёт пробега
bot.hears(/^(((\d{1,})|my\d{1,})(\,|)){2,}$/i, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.replyWithChatAction('typing')

    objects = ctx.message.text.split(',')
    
    objects = objects.map(item => {  
        if(item.toLowerCase().indexOf('my') < 0){
            return {'id': item, 'type': 'shop'}
        }else{
            return {'id': item, 'type': 'my'}
        }
    });

    var user = []
    var ur = await db.query("SELECT `region` FROM `users` WHERE `chat_id` = ?", [ctx.message.chat.id])
    user['region'] = ur[0]['region']
    user['id'] = ctx.message.chat.id
    //console.log(user)
    var result = []
    var error = []
    for(obj of objects){
        coords = await checkObject(obj, user)
        if(coords){            
            result.push({'id':obj['id'], 'type':obj['type'], 'coords': coords})
        }else{
            error.push({'id':obj['id']})
        }
    }
    if(error.length > 0){
        let text = ''
        for(err of error){
            text += "Объект "+err['id']+" не найден\r\n"
        }
        ctx.reply(text)
        return
    }else{
        objects = result
    }

    

    let odo = 0
    let text = ''
    let i = 0

    while(i < objects.length-1){
        startShop = objects[i]
        endShop = objects[i+1]
        const response = await fetch("https://maps.googleapis.com/maps/api/directions/json?origin="+startShop['coords']+"&destination="+endShop['coords']+"&key="+config.system.googleApiKey)
        data = await response.json()
        odo += data['routes'][0]['legs'][0]['distance']['value']
        odoText = data['routes'][0]['legs'][0]['distance']['text']
        text += "\r\n✅ Из: "+startShop['id']+"\r\n❎ В: "+endShop['id']+"\r\n🚗 Пробег: <b>"+odoText+"</b>\r\n=======================\r\n"
        
        i++ 
    }
    odo = odo/1000
    odo = Math.ceil(odo * Math.pow(10, 1)) / Math.pow(10, 1)
    text += "<b>Общий пробег: "+odo+" км</b>"

    ctx.reply(text, {parse_mode:"HTML"})


    //console.log(result)

}) 

bot.hears(/^Мои адреса$/, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.scene.enter('userPoints')
})

bot.hears(/^Назад$/, async (ctx)=>{
    if(!await checkReg(ctx.message.chat.id)){
        ctx.scene.enter('passw')
        return 
    }
    ctx.reply(config.msgTexts.botReady, config.msgBtns.myPoints)
})

bot.on('message', async (ctx) =>{
    ctx.reply(config.msgTexts.botReady, config.msgBtns.myPoints)
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM')) 