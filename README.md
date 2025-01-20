# ProjectCV

## About

ProjectCV is a cross-platform application (Windows and Linux) designed to create and handle versions of folders.

## Download

The binaries are available on the [releases page](https://github.com/eryalito/projectcv/releases).

## How does it work?

ProjectCV relies on [Git](https://git-scm.com/) to provide a consistent versioning. Every save is converted into a git commit, and each time the version is changed that commit is checked out, creating a new branch from there. All history is linear from that branch until another version is selected.

## Live Development

This sofware is created using [wails](https://github.com/wailsapp/wails). To run in live development mode, execute the following command in the project directory:

```sh
wails dev
```

## Contributing

We welcome pull requests (PRs) for new features, translations, or any other improvements. If you have ideas or encounter issues, feel free to open an issue to discuss them.
