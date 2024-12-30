package main

import (
	"context"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
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

func (a *App) GetGitStatus(path string) (git.Status, error) {
	repo, err := git.PlainOpen(path)
	if err != nil {
		return nil, err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return nil, err
	}

	status, err := wt.Status()
	if err != nil {
		return nil, err
	}
	return status, nil
}

func (a *App) GitAddAllFiles(path string) error {
	repo, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return err
	}

	_, err = wt.Add(".")
	if err != nil {
		return err
	}
	return nil
}

func (a *App) GitCommit(path string, message string) error {
	repo, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return err
	}

	_, err = wt.Commit(message, &git.CommitOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (a *App) GitLog(path string) ([]object.Commit, error) {
	repo, err := git.PlainOpen(path)
	if err != nil {
		return nil, err
	}

	commitIter, err := repo.Log(&git.LogOptions{All: true})
	if err != nil {
		return nil, err
	}

	var commits []object.Commit
	err = commitIter.ForEach(func(c *object.Commit) error {
		commits = append(commits, *c)
		return nil
	})
	if err != nil {
		return nil, err
	}
	return commits, nil
}

func (a *App) GitCheckout(path string, commitHash string) error {
	repo, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return err
	}

	branchExists := false
	branches, err := repo.Branches()
	if err != nil {
		return err
	}

	err = branches.ForEach(func(ref *plumbing.Reference) error {
		if ref.Name().Short() == commitHash {
			branchExists = true
		}
		return nil
	})
	if err != nil {
		return err
	}

	if branchExists {
		err = wt.Checkout(&git.CheckoutOptions{
			Branch: plumbing.NewBranchReferenceName(commitHash),
		})
		if err != nil {
			return err
		}
		return nil
	}

	err = wt.Checkout(&git.CheckoutOptions{
		Hash:   plumbing.NewHash(commitHash),
		Branch: plumbing.NewBranchReferenceName(commitHash),
		Create: true,
		Force:  true,
	})
	if err != nil {
		return err
	}
	return nil
}

func (a *App) GitGetLastCommit(path string) (*object.Commit, error) {
	repo, err := git.PlainOpen(path)
	if err != nil {
		return nil, err
	}

	commitIter, err := repo.Log(&git.LogOptions{})
	if err != nil {
		return nil, err
	}

	var commits []object.Commit
	err = commitIter.ForEach(func(c *object.Commit) error {
		commits = append(commits, *c)
		return nil
	})
	if err != nil {
		return nil, err
	}

	if len(commits) == 0 {
		return nil, nil
	}
	return &commits[0], nil
}
