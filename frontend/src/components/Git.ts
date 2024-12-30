export enum StatusCode {
    Unmodified = ' '.charCodeAt(0),
    Untracked = '?'.charCodeAt(0),
    Modified = 'M'.charCodeAt(0),
    Added = 'A'.charCodeAt(0),
    Deleted = 'D'.charCodeAt(0),
    Renamed = 'R'.charCodeAt(0),
    Copied = 'C'.charCodeAt(0),
    UpdatedButUnmerged = 'U'.charCodeAt(0)
}

export function getGitStatusCode(staging: string, worktree: string): StatusCode {
    const stagingChar = String.fromCharCode(parseInt(staging));
    const worktreeChar = String.fromCharCode(parseInt(worktree));

    if (worktreeChar === ' ' && stagingChar === ' ') {
        return StatusCode.Unmodified;
    }
    if (stagingChar === '?') {
        return StatusCode.Untracked;
    }
    if (worktreeChar === 'M') {
        return StatusCode.Modified;
    }
    if (worktreeChar === 'A' && stagingChar === ' ') {
        return StatusCode.Added;
    }
    if (worktreeChar === 'D' && stagingChar === ' ') {
        return StatusCode.Deleted;
    }
    if (worktreeChar === 'R' && stagingChar === ' ') {
        return StatusCode.Renamed;
    }
    if (worktreeChar === 'C' && stagingChar === ' ') {
        return StatusCode.Copied;
    }
    if (worktreeChar === 'U' && stagingChar === ' ') {
        return StatusCode.UpdatedButUnmerged;
    }
    return StatusCode.Unmodified;
}

export function getGitStatusText(status: StatusCode): string {
    switch (status) {
        case StatusCode.Unmodified:
            return 'git.unmodified';
        case StatusCode.Untracked:
            return 'git.untracked';
        case StatusCode.Modified:
            return 'git.modified';
        case StatusCode.Added:
            return 'git.added';
        case StatusCode.Deleted:
            return 'git.deleted';
        case StatusCode.Renamed:
            return 'git.renamed';
        case StatusCode.Copied:
            return 'git.copied';
        case StatusCode.UpdatedButUnmerged:
            return 'git.updatedButUnmerged';
        default:
            return 'git.unknown';
    }
}
