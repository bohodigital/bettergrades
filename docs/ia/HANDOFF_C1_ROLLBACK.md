# BetterGrades Findability Handoff 1 rollback

Before production, abandon the feature branch or revert its feature commit. After merge, revert the merge commit through a reviewed pull request, rebuild exact main, and redeploy through the existing BetterGrades Pages wrapper.

If only production behavior fails, redeploy the recorded previous immutable production package. Do not change DNS, Pages project ownership, bindings, analytics identifiers, or credentials. Verify apex, `www`, stable Pages, and the rollback immutable URL after restoration.
