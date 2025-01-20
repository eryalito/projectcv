package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	ConfigFilePath = "projectcv.config.json"
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
		fmt.Println(err)
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

	_, err = wt.Commit(message, &git.CommitOptions{
		Author: &object.Signature{
			Name:  "ProjectCV",
			Email: "",
			When:  time.Now(),
		},
		Committer: &object.Signature{
			Name:  "ProjectCV",
			Email: "",
			When:  time.Now(),
		},
	})
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

func (a *App) SetConfig(key, value string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("could not get home directory: %v", err)
	}

	filePath := filepath.Join(homeDir, ConfigFilePath)

	var data map[string]string

	// Check if the file exists
	if _, err := os.Stat(filePath); err == nil {
		// File exists, read it
		fileContent, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("could not read file: %v", err)
		}

		// Unmarshal the JSON data
		err = json.Unmarshal(fileContent, &data)
		if err != nil {
			return fmt.Errorf("could not unmarshal JSON: %v", err)
		}
	} else {
		// File does not exist, create a new map
		data = make(map[string]string)
	}

	// Add or update the key-value pair
	data[key] = value

	// Marshal the data back to JSON
	fileContent, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return fmt.Errorf("could not marshal JSON: %v", err)
	}

	// Write the JSON data to the file
	err = os.WriteFile(filePath, fileContent, 0644)
	if err != nil {
		return fmt.Errorf("could not write file: %v", err)
	}

	return nil
}

func (a *App) GetConfig(key string) (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("could not get home directory: %v", err)
	}

	filePath := filepath.Join(homeDir, ConfigFilePath)

	// Check if the file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return "", fmt.Errorf("file does not exist")
	}

	// Read the file
	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("could not read file: %v", err)
	}

	// Unmarshal the JSON data
	var data map[string]string
	err = json.Unmarshal(fileContent, &data)
	if err != nil {
		return "", fmt.Errorf("could not unmarshal JSON: %v", err)
	}

	// Retrieve the value for the given key
	value, exists := data[key]
	if !exists {
		return "", fmt.Errorf("key does not exist")
	}

	return value, nil
}
