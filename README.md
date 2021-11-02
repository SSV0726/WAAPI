# AUTO-WHATSAPP

1. If no-sandbox error comes related to puppeteer:
    Go to : node_modules > puppeteer > lib > ejs > puppeteer > node > Launcher.js 
    Put  '--no-sandbox',
         '--disable-setuid-sandbox',
                                      on 121 line in Launcher.js