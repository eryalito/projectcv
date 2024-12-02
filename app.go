package main

import (
	"context"
	"fmt"

	"github.com/go-git/go-git/v5"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ChooseFolder() (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Choose a folder",
	})
}

func (a *App) InitGitRepoIfNotExists(path string) error {
	_, err := git.PlainInit(path, false)
	if err != nil {
		if err == git.ErrRepositoryAlreadyExists {
			return nil
		}
	}
	return nil
}

func (a *App) GetGitStatus(path string) (string, error) {
	repo, err := git.PlainOpen(path)
	if err != nil {
		return "", err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return "", err
	}

	status, err := wt.Status()
	if err != nil {
		return "", err
	}
	fmt.Println("asd")
	fmt.Println(status)
	return status.String(), nil
}
