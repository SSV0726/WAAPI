# WA_API

If no-sandbox error comes related to puppeteer: Go to : node_modules > puppeteer > lib > cjs > puppeteer > node > Launcher.js

Put '--no-sandbox', '--disable-setuid-sandbox', on 121 line in Launcher.js

                               In chromeArguments = [ . . . ] 
message => { mediaKey: undefined, id: { fromMe: false, remote: '918459953212@c.us', id: '3EB0B4E55B44BF2AC051', _serialized: 'false_918459953212@c.us_3EB0B4E55B44BF2AC051' }, ack: 0, hasMedia: false, body: 'Hi', type: 'chat', timestamp: 1635850155, from: '918459953212@c.us', to: '918080166671@c.us', author: undefined, deviceType: 'web', isForwarded: false, forwardingScore: 0, isStatus: false, isStarred: false, broadcast: false, fromMe: false, hasQuotedMsg: false, location: undefined, vCards: [], inviteV4: undefined, mentionedIds: [], orderId: undefined, token: undefined, links: [] }