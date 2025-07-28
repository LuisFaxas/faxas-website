# Branch Protection Rules

## Setup Instructions

To protect the `main` branch, configure the following rules in GitHub:

1. Go to Settings → Branches
2. Add a branch protection rule for `main`
3. Enable these settings:

### Required Status Checks
- ✅ **Require status checks to pass before merging**
  - `Test, Type Check & Lint`
  - `Build Check`
  - `Lighthouse CI`
  - `All Checks Passed`

- ✅ **Require branches to be up to date before merging**

### Pull Request Requirements
- ✅ **Require pull request reviews before merging**
  - Required approving reviews: 1 (adjust based on team size)
  - Dismiss stale pull request approvals when new commits are pushed

- ✅ **Require conversation resolution before merging**

### Additional Settings
- ✅ **Include administrators** (optional, but recommended)
- ✅ **Allow force pushes** → Disable
- ✅ **Allow deletions** → Disable

## Merge Requirements Summary

Before any PR can be merged to `main`:
1. All CI checks must pass (tests, types, lint, build, Lighthouse)
2. Code must be reviewed and approved
3. All conversations must be resolved
4. Branch must be up to date with main

## Bypass for Emergencies

If you need to bypass protections in an emergency:
1. Use admin privileges (if "Include administrators" is disabled)
2. Document the reason in the PR description
3. Get post-merge review as soon as possible