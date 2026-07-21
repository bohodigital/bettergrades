# Unit 4 rollback

## Before merge

Delete the private candidate, close the pull request without merging, and remove the isolated Unit 4A worktree/branch after preserving evidence. Production remains unchanged.

## After merge but before production promotion

Revert the Unit 4A merge commit on `main`, rerun the full build and route tests, and keep the prior production deployment active.

## After production promotion

Promote the prior known-good Cloudflare Pages deployment and verify the release marker, root page, Unit 3B canaries, API boundaries, sitemap, robots, and redirect behavior. Then revert the Unit 4A merge in Git so source and production converge again.

Never delete the Pi intake archive or release evidence during rollback.
