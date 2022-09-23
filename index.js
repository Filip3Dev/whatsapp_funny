const wa = require('@open-wa/wa-automate');
const mime = require('mime-types');
const fs = require('fs');

wa.create({
  sessionId: "HELPER",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: false,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
  client.onMessage(async message => {
    if (message.body === 'oi' || message.body === 'Oi' || message.body === 'e ai') {
      await client.reply(message.from, 'Opa 👋!', message.id, false);
    }
  });
  client.onMessageDeleted(async message => {
    if (message.from !== 'status@broadcast') {
      if (message.type  === 'chat') {
        await client.sendText(message.from, 'Apagou a mensagem mais eu vi viu!');
      }
      if (message.type  === 'image') {
        await client.sendText(message.from, 'Apagou foto mais eu vi viu!');
        const mediaData = await wa.decryptMedia(message);
        const filename = `${message.t}.${mime.extension(message.mimetype)}`;
        const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString('base64')}`;
        await client.sendImage(
          message.from,
          imageBase64,
          filename,
          `Me mandou essa ${message.type}m`
        );
        fs.writeFile(filename, mediaData, function(err) {
          if (err) {
            return console.log(err);
          }
          console.log('The file was saved!');
        });
      }
      console.log(message);
    }
  });
}