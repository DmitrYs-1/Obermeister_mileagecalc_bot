const { Scenes, Markup } = require('telegraf');

const config = require('../config')
const db = require('../db');

const adm = new Scenes.BaseScene('adm')
adm.enter(async (ctx)=>{ 
    let users = await db.query("SELECT COUNT(*) FROM `users`")
    let user_objects = await db.query("SELECT COUNT(*) FROM `user_objects`")
    let shops = await db.query("SELECT COUNT(*) FROM `all_shops`")
    let text = ''
    text = `<b>Всего пользователей:</b> <i>${users[0]['COUNT(*)']}</i>
<b>Всего сохранённых адресов:</b> <i>${user_objects[0]['COUNT(*)']}</i>
<b>Магазинов в базе:</b> <i>${shops[0]['COUNT(*)']}</i>
`

    //keyboard = Markup.keyboard(['Поиск магазина']).resize()
    await ctx.replyWithHTML(text)
})

adm.hears(/^[0-9]{1,}$/, async (ctx)=>{

    let shop = await db.query("SELECT * FROM `all_shops` WHERE `id` = ?", [ctx.message.text])

    //console.log(shop)
    for(s of shop){
        ctx.replyWithHTML(`<pre>${JSON.stringify(s)}</pre>`)
    }
    
})

adm.on('message', async (ctx)=>{
    ctx.scene.leave()
})

module.exports = adm