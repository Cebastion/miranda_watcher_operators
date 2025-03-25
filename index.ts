import * as WebSocket from 'ws';
import { Chat } from './enum/chat.enum';

const ws = new WebSocket('wss://cstat.nextel.com.ua:11444/proxima/28', {
    headers: {
        'Origin': 'https://my.unitalk.cloud',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }
});

ws.on('open', function open() {
    console.log('✅ Соединение установлено!');

    const authMessage = {
        requestId: 70311,
        type: "AUTHORIZATION",
        token: "O5aRgbiiDu0Q"
    };

    ws.send(JSON.stringify(authMessage));
    console.log('📤 Отправлен запрос авторизации:', authMessage);
});

ws.on('message', function incoming(data: WebSocket.RawData) {
    const chat = JSON.parse(data.toString());
    if (chat.type === Chat.MESSAGES) {
        chat.content.forEach((msg: any) => {
            if (msg.operatorId && !msg.whisper) {
                console.log('📥 Получено сообщение:', msg.userName, msg.text, msg.chatId, msg.date);
            }
        });
    }
});

ws.on('close', function close(code: number, reason: string) {
    console.log(`🔴 Соединение закрыто. Код: ${code}, Причина: ${reason}`);
});

ws.on('error', function error(err: Error) {
    console.error('❌ Ошибка:', err);
});

