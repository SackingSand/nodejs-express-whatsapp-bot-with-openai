import { Response, Request } from 'express';
import { Client, LocalAuth } from 'whatsapp-web.js'
import OpenAI from 'openai';
import axios from 'axios';

export default class WhatsappInstance {

    waClient: Client | undefined;
    private qrCode: any = '';
    private session: any = '';
    
    openAI: OpenAI;
    userchat: any = {}

    constructor(){
        try {
            this.waClient = new Client({
                authStrategy: new LocalAuth(),
                puppeteer: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                }
            });
        } catch (err) {
            this._initWhatsapp()
        }
        this.openAI = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
            // organization: process.env.OPENAI_ORG,
        });
        this._initClient();
    }

    _initClient(){
        this.waClient?.on('ready', () => {
            console.log('Client is ready!');
        });
        
        this.waClient?.on('qr', qr => {
            console.log('QR is ready!');
            this.qrCode = qr
        });

        this.waClient?.on('authenticated', (session) => {    
            this.session = session
            console.log('authenticated!', session)
        });        
        
        this.waClient?.on('message', async message => {
            let name = await message.getContact()
            console.log(name.name, ` (${name.pushname ?? name.shortName})` , ': ', message.body);
            const flag = message.body.substring(0, 3)
            if(flag === '!ai' && !!name.name){
                if(!this.userchat.hasOwnProperty(name.name)){
                    this.userchat[name.name] = [{ role: 'user', content: message.body.replace('!ai ', '') }]
                } else {
                    this.userchat[name.name].unshift({ role: 'user', content: message.body.replace('!ai ', '') })
                }
                try {
                    const aiReply = await this.openAI.chat.completions.create({
                        messages: this.userchat[name.name].slice(0, 10),
                        model: 'gpt-3.5-turbo'
                    })
                    console.log(`ai reply choices:`)
                    console.log(aiReply.choices)
                    this.userchat[name.name].unshift({ role: 'assistant', content: aiReply.choices[0].message })
                } catch (err: any) {
                    // message.reply(`Hi ${name.shortName ?? name.pushname ?? name.name}, saat ini system ai nya belom aktif nih. Coba lagi lain kali ya`)
                    // if(message.body.includes('canda') || message.body.includes('joke')){
                        try {
                            const jokeRequest = await axios.get('https://candaan-api.vercel.app/api/text')
                            const joke = jokeRequest.data['data']
                            this.waClient?.sendMessage(name.id._serialized, joke[Math.floor(Math.random() * joke.length)]);
                        } catch (err) {
                            message.reply('Sorry nih, niatnhya mau ngejokes, tapi api jokenya ga bisa dihubungin :( ')
                        }
                    // }
                    console.log(this.userchat[name.name])
                }
            }
        });        

        this.waClient?.initialize();
    }

    _initWhatsapp(){
        try {
            this.waClient = new Client({
                authStrategy: new LocalAuth(),
                puppeteer: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                }
            });
        } catch (err: any) {
            console.log(err.message);
            this._initWhatsapp();
        }
    }

    getQR(): any {
        return this.qrCode
    }

    getSession(): any {
        return this.session
    }

    async getContacts(): Promise<any> {
        return await this.waClient?.getContacts()
    }

    async getAuth(): Promise<any> {
        return await this.waClient?.getLabels()
    }

    async getChats(id: any): Promise<any> {
        return await this.waClient?.getMessageById(id)
    }

}