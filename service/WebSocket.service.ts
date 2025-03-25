import WebSocket from 'ws';
import fs from 'fs'
import { EEvents } from '../enum/event.enum';

export class WebSocketService {
    private ws = new WebSocket('wss://cstat.nextel.com.ua:11444/proxima/28');
    constructor() {
        this.ws.on(EEvents.message, this.getChatMessages())
    }
    static connetect() {
        console.log('✅ Соединение установлено!');

        // Отправляем команду авторизации
        const authMessage = {
            requestId: 70311,
            type: "AUTHORIZATION",
            token: "O5aRgbiiDu0Q"
        };

        this.ws.send(JSON.stringify(authMessage));
        console.log('📤 Отправлен запрос авторизации:', authMessage);
    }

    getChatMessages(data: any) {
        try {
            const chat = JSON.parse(data.toString());
            if (chat.type === 'MESSAGES') {
                chat.content.forEach((msg: { userName: string; text: string; chatId: string }) => {
                    console.log('📥 Получено сообщение:', msg.userName, msg.text, msg.chatId);

                    const chatData = { OperatorName: msg.userName, text: [msg.text], chatId: msg.chatId };

                    fs.writeFile('data.json', JSON.stringify(chatData, null, 2), 'utf8', (err) => {
                        if (err) console.error('❌ Ошибка записи в файл:', err);
                    });
                });
            }
        } catch (error) {
            console.error('❌ Ошибка обработки данных:', error);
        }
    }

    static getError(error: Error) {
        console.error('❌ Ошибка:', error);
    }

    static disconnect(code: number, reason: Buffer<ArrayBufferLike>) {
        console.log(`🔴 Соединение закрыто.Код: ${code}, Причина: ${reason.toString()}`);
    }
}
