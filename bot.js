import BaseBot from "./baseBot.js";
import { isValidURL, convertToUrl, updateUrlToHttps, removeHttpsAndWww } from "./modules.js"
import messageBot from "./messageBot.js"
import ddgSearch from "./duckduckgo.js"

// my main BOt here 
export default class Bot extends BaseBot {
    constructor(env){
        super(env)
    }

    async onUpdate(update) {
        if(update.message) {
            const message = update.message
            const chatId = message.chat.id;
            const text = message.text;
        
            if (text.startsWith("/")) {
            const {command, param} = this.parseCommand(text)
            await this.onCommand(chatId, command, param)
            } else {
                await this.onMessage(chatId, text)
            }
        }
    }

    // when receive message from user 
    async onMessage(chatId, text){
        //const urlOpen = convertToUrl(text);

        if(!isValidURL(text)) {

            // this bot get message from user
            // and search duckduckgo 
            let { links, titles } = await ddgSearch(text)
            links = links.slice(0, 5)
            for(let i=0; i < links.length; i++){

                // and return result for user 
                await this.makeRequest("sendMessage", {
                    chat_id: chatId,
                    text: titles[i],
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard:[[
                            {
                                text: removeHttpsAndWww(links[i]), 
                                web_app: {
                                    "url": links[i]
                                }
                            }
                        ]]
                    },
                    disable_notification: true
                })
            }
            // await this.sendMessge(chatId, `Please send me a url.\nEx: https://example.com or example.com`)
            return
        }

        const urlOpen = updateUrlToHttps(text)
       
        try {
            await this.makeRequest("sendMessage", {
                chat_id: chatId,
                text: "Click button below to open",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard:[[
                        {
                            text: urlOpen, 
                            web_app: {
                                "url": urlOpen
                            }
                        }
                    ]]
                }
            })
        } catch (error) {
            if(error == "Error: Bad Request: BUTTON_URL_INVALID") {
                await this.sendMessge(chatId, `Please send me a url.\nEx: https://example.com or example.com`)
            }
        }
    }

    async onCommand(chatId, command, param) {
        switch (command) {
        case "start":
            await this.sendMessge(chatId, messageBot.start)
            break;
        case "help":
            await this.sendMessge(chatId, messageBot.start)
            break;
        case "info":
            await this.sendMessge(chatId, messageBot.info)
            break;
        }
    }
}
