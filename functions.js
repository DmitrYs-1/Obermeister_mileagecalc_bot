const config = require('./config');
const db = require('./db');

module.exports = {
    checkReg: async (chatId) => {
        let userId = await db.query("SELECT * FROM `users` WHERE chat_id = ?", [chatId]);
        return (userId.length > 0) ? true : false;
    },
    checkObject: async (obj, user) => {
        if (obj['type'] == 'my') {
            result = await db.query("SELECT `coords` FROM `user_objects` WHERE chat_id = ? AND name = ?", [user['id'], obj['id']]);
            return (result.length > 0) ? result[0]['coords'] : false;
        } else if (obj['type'] == 'shop') {
            result = await db.query("SELECT `coords` FROM `all_shops` WHERE id = ? AND `region` = ?", [obj['id'], user['region']]);
            return (result.length > 0) ? result[0]['coords'] : false;
        }else{
            return false
        }
    }
}