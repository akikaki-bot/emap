
const {
    app,
    BrowserWindow,
} = require('electron')



//const menu = Menu.buildFromTemplate([{ label: "著者表示"} , { label : "KeeWについて"}])
//Menu.setApplicationMenu(menu)


const path = require('path')


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1450,
        height: 740,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js")
        },
        //maximizable: false,
        //nodeIntegration: false
    })
   win.setMenuBarVisibility(false);
   win.loadFile('src/index.html')
    
    win.webContents.setWindowOpenHandler(({ url }) => {
      console.log(url)
        if (url.match(/file:/)) {
          return {
            action: 'allow',
            overrideBrowserWindowOptions: {
              resizable: false,
              closable: true,
              frame: false,
              fullscreenable: false,
              menubar: false,
            }
          }
        }
        
        return { action: 'deny' }
      })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
})

app.on('window-all-closed', () => {
    if(process.platform !=="darwin") app.quit()
})
