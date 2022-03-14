require('dotenv').config()
const { Markup } = require('telegraf');

const config = {
    db: {
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        pass    : process.env.DB_PASS,
        name    : process.env.DB_NAME
    },
    system: {
        botPassword: process.env.BOT_PASSWD,
        googleApiKey: process.env.GOOGLE_KEY,
        tgToken: process.env.TG_TOKEN,
        helpText: `
<b><u>Калькулятор пробега v2.0 Автор <a href="tg://user?id=301046456">@МСИ Семёнов Дмитрий</a></u></b>\r\n 
\r\n
<b>Возможности бота:</b>
Бот предназначен для удобного и быстрого расчёта растояния между магазинами сети TC5 для заполнения маршрутного листа.
Для работы с ботом нужно написать номера магазинов и/или сохранённых адресов через запятую без пробелов в порядке следования. Пример: <pre>4538,4937,my1,5582,my3</pre>
В ответ бот отправит информацию о пробеге между адресами и итоговый пробег по маршруту.
\r\n
<b>Сохранённые адреса:</b>
Вы можете сохранить неограниченное количество своих адресов и использовать их наравне с номерами магазинов в расчёте пробега по маршруту.
Для просмотра сохранённых адресов нажмите кнопку "Мои адреса" под окном ввода сообщения. В ответ вы получите список всех сохранённых вами адресов с возможностью добавления новых и удаления ненужных.    
\r\n
Для расчёта расстояний используется сервис google.com/maps
\r\n
Автор бота <a href="tg://user?id=301046456">МСИ Семёнов Дмитрий</a>
Если вы нашли баг, у вас есть вопросы или пожелания по работе бота пишите автору

Автору на пиво: <a href='https://www.tinkoff.ru/cf/15CsNYOImOO'>>>ТЫК<<</a>
`        
    },
    msgTexts:{
        botReady: "Бот готов к работе! Для справки команда /help"
    },
    msgBtns:{
        myPoints: Markup.keyboard(['Мои адреса']).resize()
    }
}


module.exports = config;