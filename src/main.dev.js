import { app, BrowserWindow, Menu } from 'electron'
import applicationMenu from './applicationMenu'
import Logger from './utils/Logger'
import setting from './utils/Settings'
import backend from './modules'

const logger = Logger.getLogger('main')

if (setting.network.includes('main')) {
  console.log('connecting to main network')
}

let mainWindow

async function createWindow () {
  logger.info('creating main window')
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  if (process.env.NODE_ENV = 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    logger.info('finish loading main window')
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

async function onReady() {
  await backend.init()
  Menu.setApplicationMenu(applicationMenu)
  await createWindow()
}

app.on('ready', onReady)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// const testConfig = {
//   pwd: 'wanglu123',
//   chainType: 'WAN',
//   walletID: 1,
//   path: "m/44'/5718350'/0'/0/0",
// }

// const generatePhrase = (targetWindow, pwd) => {
//   try {
//     const phrase = hdUtil.generateMnemonic(pwd)
//     targetWindow.webContents.send('phrase-generated', phrase)
//   } catch (err) {
//     logger.error(err.stack)
//   }
// }

// const revealPhrase = (targetWindow, pwd) => {
//   let mnemonic
//   try {
//     mnemonic = hdUtil.revealMnemonic(pwd)
//     targetWindow.webContents.send('phrase-revealed', phrase)
//   } catch (err) {
//     logger.error(err.stack)
//   }
// }

// const validatePhrase = (targetWindow, phrase) => {
//   let ret
//   try {
//     ret = hdUtil.validateMnemonic(phrase)
//     targetWindow.webContents.send('phrase-valid', ret)
//   } catch (err) {
//     logger.error(err.stack)
//   }
// }

// const getAddress = async (targetWindow, walletID, chainType, path) => {
//   let address
//   try {
//     address = await hdUtil.getAddress(walletID, chainType, path)
//     targetWindow.webContents.send('address-generated', address)
//   } catch (err) {
//     logger.error(err.stack)
//   } 
// }

// export { generatePhrase, revealPhrase, validatePhrase, getAddress }

// const testHDWallet = async () => {
//     try {
//         const walletBackend = new walletCore({
//             "useLocalNode" : false,
//             "loglevel" : "debug",
//             "MIN_CONFIRM_BLKS" : 0,
//             "MAX_CONFIRM_BLKS" : 1000000,
//             "network" : "testnet"
//           });
      
//         const {pwd, walletID, chainType, path} = testConfig;
        
//         logger.info('start init wallet backend');
//         await walletBackend.init();
//         console.log(global.crossInvoker)
//         logger.info('finish init wallet backend');
//         // const pwd = 'wanglu123';
//         // generatePhrase(pwd);
//         let phrase = revealPhrase(pwd);
//         console.log('phrase: ', phrase);
        
//         validatePhrase(phrase);
//         hdUtil.initializeHDWallet(phrase);
    
//         let addr = await getAddress(walletID, chainType, path);
    
//         logger.info(JSON.stringify(addr))
    
//         const from = '0x' + addr.address;
    
//         const balance = await ccUtil.getWanBalance(from);
    
//         logger.info('balance: ' + balance);
    
//         if (balance) {
//         const input = {
//             symbol: chainType,
//             from: from,
//             to: '0x620b168aD1cBaE2bF69f117AAEC7a0390917b473',
//             amount: 1,
//             gasPrice: 180,
//             gasLimit: 1000000,
//             password: pwd,
//             BIP44Path: path,
//             walletID: walletID
//         }
    
//         let srcChain = global.crossInvoker.getSrcChainNameByContractAddr(chainType, chainType);
        
//         let ret = await global.crossInvoker.invokeNormalTrans(srcChain, input);
    
//         logger.info(JSON.stringify(ret));
//           } else {
//             logger.warn('do not have enough balance');
//           }
//     } catch (err) {
//       logger.error(err.stack);
//     }
//     app.quit();
// } 
