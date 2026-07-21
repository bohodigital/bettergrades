# Unit 4 rollback

## Before merge

Delete the private candidate, close the pull request without merging, and remove the isolated Unit 4B worktree/branch after preserving evidence. Production remains on the accepted Unit 4A tree.

## After merge but before production promotion

Revert the Unit 4B merge commit on `main`, rerun the full build and route tests, and keep the accepted Unit 4A production deployment active.

## After production promotion

Promote immutable Unit 4A deployment `23816f0f.bettergrades-vhc.pages.dev` and verify the release marker, root page, Units 3B and 4A canaries, API boundaries, sitemap, robots, search, and redirect behavior. Then revert the Unit 4B merge in Git so source and production converge again.

Never delete the Pi intake archive or release evidence during rollback.
