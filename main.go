package main

import (
	"embed"
	// Add this import
	"github.com/labstack/gommon/log"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "ProjectCV",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Menu: createMenu(app),
	})

	if err != nil {
		println("Error:", err.Error())
	}

}

func createMenu(app *App) *menu.Menu {
	appMenu := menu.NewMenu()

	fileMenu := appMenu.AddSubmenu("File")
	fileMenu.AddText("Open", keys.CmdOrCtrl("o"), func(_ *menu.CallbackData) {
		log.Info("Open file selected")
		runtime.EventsEmit(app.ctx, "openFolderSelected")
	})

	fileMenu.AddSeparator()
	fileMenu.AddText("Exit", nil, func(_ *menu.CallbackData) {
		runtime.Quit(app.ctx)
	})

	viewMenu := appMenu.AddSubmenu("View")
	viewMenu.AddText("Toggle Fullscreen", keys.Key("F11"), func(_ *menu.CallbackData) {
		if runtime.WindowIsFullscreen(app.ctx) {
			runtime.WindowUnfullscreen(app.ctx)
		} else {
			runtime.WindowFullscreen(app.ctx)
		}
	})

	return appMenu
}
