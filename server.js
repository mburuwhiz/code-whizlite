// ==================================================
// PROJECT BLUEPRINT: WHIZLITE | Pairing Code
// VERSION: 5.0 (Final Stable Version)
// AUTHOR: WHIZ MBURU
// ==================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs-extra');
const Pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const { parsePhoneNumber } = require('libphonenumber-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const logger = Pino({ level: 'silent' });

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const startWhatsAppConnection = async (phoneNumber) => {
        const sessionDir = path.join(__dirname, 'sessions', `session-${socket.id}`);
        
        try {
            const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

            const sock = makeWASocket({
                logger,
                printQRInTerminal: false,
                browser: ['Chrome (Linux)', '', ''],
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
                },
            });

            if (!sock.authState.creds.registered) {
                let phoneNumberData;
                try {
                    phoneNumberData = parsePhoneNumber('+' + phoneNumber.replace(/[^0-9]/g, ''));
                    if (!phoneNumberData || !phoneNumberData.isValid()) {
                         return socket.emit('error', 'Invalid phone number: Please provide a valid number with your country code.');
                    }
                } catch (error) {
                    return socket.emit('error', 'Invalid phone number format. Please include your country code (e.g., 2547...).');
                }
                const formattedPhoneNumber = phoneNumberData.number.replace('+', '');
                
                socket.emit('status', 'Generating code...');
                
                setTimeout(async () => {
                    try {
                        const code = await sock.requestPairingCode(formattedPhoneNumber);
                        const formattedCode = code.match(/.{1,4}/g).join('-');
                        socket.emit('pairing_code', formattedCode);
                    } catch (error) {
                        console.error("Error requesting pairing code:", error);
                        socket.emit('error', 'Could not generate pairing code. The number might be banned or invalid.');
                        await fs.remove(sessionDir);
                    }
                }, 2000); // Reduced delay
            }

            sock.ev.on('connection.update', async (update) => {
                const { connection } = update;
                if (connection === 'open') {
                    console.log(`[SUCCESS] Connection opened for ${socket.id}`);
                    
                    const credsPath = path.join(sessionDir, 'creds.json');
                    const credsData = await fs.readFile(credsPath, 'utf-8');
                    const sessionID = Buffer.from(credsData).toString('base64');
                    const userJid = sock.authState.creds.me.id;

                    const successMessage = `
✨ *Pairing Successful!* ✨
-----------------------------------
Welcome to the WhizLite Bot family!
*Credit:* WHIZ MBURU (github.com/mburuwhiz)
-----------------------------------
🚀 *Deployment Ready*
_You can now use the Session ID from the message above to deploy your bot._
-----------------------------------
⚠️ *IMPORTANT SECURITY WARNING* ⚠️
_Your Session ID is like a password. *NEVER* share it with anyone!_
-----------------------------------
`;
                    await sock.sendMessage(userJid, { text: sessionID });
                    await sock.sendMessage(userJid, { text: successMessage });
                    
                    socket.emit('session_sent');
                    
                    await sock.logout();

                } else if (connection === 'close') {
                    console.log(`[CLOSED] Connection closed for ${socket.id}. Cleaning up.`);
                    await fs.remove(sessionDir);
                }
            });

            sock.ev.on('creds.update', saveCreds);

        } catch (error) {
            console.error('An error occurred during WhatsApp connection:', error);
            socket.emit('error', 'Failed to initialize WhatsApp. Please refresh and try again.');
            await fs.remove(sessionDir);
        }
    };

    socket.on('get_code', (phoneNumber) => {
        startWhatsAppConnection(phoneNumber).catch(err => {
            console.error("Failed to start WhatsApp connection from socket event:", err);
            socket.emit('error', 'An unexpected server error occurred.');
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const sessionDir = path.join(__dirname, 'sessions', `session-${socket.id}`);
        fs.remove(sessionDir);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WHIZLITE Server v5.0 (Final) is running on http://localhost:${PORT}`);
});