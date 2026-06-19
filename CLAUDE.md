# Project Rules

## GitHub Sync

When asked to sync or push updates to the GitHub repo:

1. Attempt the push using available git remotes or the GitHub MCP tools.
2. If a 403 / permission error occurs, inform the user that a token is needed and ask them to generate one using this flow:

   > **github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)**
   > - Scope: `repo`
   > - Expiration: 30 days (or any)
   >
   > Then paste the token here.

3. Once the token is received, use it to complete the push via `git remote set-url` or the GitHub API (curl PUT).
