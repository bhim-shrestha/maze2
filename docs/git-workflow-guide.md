# Git Workflow Guide: Maze Game Development

## Project Overview
This document outlines the complete Git workflow and development process for the City Maze game project, from initial development chaos to organized feature branch management.

## Table of Contents
- [Initial Situation](#initial-situation)
- [Branch Strategy](#branch-strategy)
- [Development Workflow](#development-workflow)
- [Common Git Commands](#common-git-commands)
- [Problem Resolution](#problem-resolution)
- [Best Practices](#best-practices)
- [Repository Cleanup](#repository-cleanup)

## Initial Situation

### The Problem
- All development was done directly on the `main` branch
- No organized commit structure
- Multiple experimental changes mixed together
- Need to separate stable code from experimental features
- Ready to implement proper Git workflow for future development

### Development Context
- **Framework**: Next.js 15.5.1-canary.23 with TypeScript
- **Features Implemented**: 
  - Mathematical scoring system (time-squared degradation)
  - Responsive mobile/desktop controls
  - Dynamic imports fix for runtime errors
  - Comprehensive game enhancements

## Branch Strategy

### Branch Structure
```
main (stable/production)
├── feature/enhanced-maze-game (development features)
└── [future feature branches]
```

### Branch Purposes
- **`main`**: Original stable code, production-ready releases
- **`feature/enhanced-maze-game`**: All new enhancements and experimental features
- **Future branches**: Each new feature gets its own branch

## Development Workflow

### 1. Setting Up Feature Branch
```bash
# Check current status
git status
git branch -a

# Create and switch to feature branch
git checkout -b feature/enhanced-maze-game

# Push new branch to remote
git push -u origin feature/enhanced-maze-game
```

### 2. Making Changes
```bash
# Make your code changes
# Then add and commit
git add .
git commit -m "feat: implement mathematical scoring system with time-squared degradation"

# Push to feature branch
git push origin feature/enhanced-maze-game
```

### 3. When Ready to Merge
```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge feature branch
git merge feature/enhanced-maze-game

# Push updated main
git push origin main
```

## Common Git Commands

### Daily Development Commands
```bash
# Check status and branches
git status
git branch -a
git log --oneline -5

# Working with changes
git add .
git add <specific-file>
git commit -m "type: description"
git push origin <branch-name>

# Switching branches
git checkout main
git checkout feature/enhanced-maze-game
git checkout -b new-feature-branch
```

### Commit Message Types
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks (like .gitignore updates)
- `docs:` - Documentation updates
- `refactor:` - Code refactoring without feature changes
- `style:` - Code formatting changes

### Branch Management
```bash
# List all branches
git branch -a

# Delete local branch (after merging)
git branch -d feature-name

# Delete remote branch
git push origin --delete feature-name

# Rename current branch
git branch -m new-branch-name
```

## Problem Resolution

### Issue 1: Divergent Histories
**Problem**: `git push origin main` failed with "divergent histories"
```
error: failed to push some refs to 'origin'
hint: Updates were rejected because the tip of your current branch is behind
```

**Solution**: Force push after confirming local changes are correct
```bash
git push --force-with-lease origin main
```

**Prevention**: Always pull before pushing, use feature branches

### Issue 2: Runtime Error - "Element type is invalid"
**Problem**: Dynamic imports causing React runtime errors
```
Error: Element type is invalid: expected a string (for built-in components) or a class/function
```

**Solution**: Fix dynamic import syntax
```typescript
// ❌ Incorrect
import { dynamic } from 'next/dynamic';
const ClientMaze = dynamic(() => import('../ClientMaze'), { ssr: false });

// ✅ Correct
import dynamic from 'next/dynamic';
const ClientMaze = dynamic(() => import('../ClientMaze'), { ssr: false });
```

### Issue 3: Build Files in Git
**Problem**: `.next/` build files were tracked in Git (65 files, 10,684 lines)

**Solution**: Remove from tracking and update .gitignore
```bash
# Remove from Git tracking
git rm -r --cached .next/

# Add to .gitignore
echo ".next/" >> .gitignore

# Commit the cleanup
git add .gitignore
git commit -m "chore: remove .next build files from Git tracking"
```

## Best Practices

### Repository Management
1. **Never commit build files** - Use comprehensive .gitignore
2. **Use meaningful commit messages** - Follow conventional commit format
3. **Feature branches** - Keep main branch stable
4. **Regular commits** - Small, focused changes
5. **Pull before push** - Avoid merge conflicts

### Development Workflow
1. **Start with feature branch** for any new work
2. **Test locally** before committing
3. **Clean commit history** - squash related commits if needed
4. **Code review** - even for solo projects, review your changes
5. **Backup important work** - but clean up unnecessary branches

### File Management
```bash
# Always check what you're committing
git diff --cached

# Use .gitignore for generated files
# Our comprehensive .gitignore covers:
- Build files (.next/, dist/, build/)
- Dependencies (node_modules/, .pnp/)
- Environment files (.env*)
- IDE files (.vscode/, .idea/)
- OS files (.DS_Store, Thumbs.db)
- Logs (*.log, logs/)
```

## Repository Cleanup

### What We Cleaned Up
1. **Removed 65 build files** from `.next/` directory
2. **Implemented comprehensive .gitignore** (131 lines, 13 categories)
3. **Deleted unnecessary backup branch**
4. **Organized commit history** with meaningful messages

### Current Clean State
```bash
# Repository structure after cleanup
main (stable)                    # Original working code
feature/enhanced-maze-game       # All enhancements and new features

# Protected file types (in .gitignore):
- Build outputs
- Dependencies
- Environment variables
- IDE configurations
- Operating system files
- Log files
- Cache directories
```

### Verification Commands
```bash
# Verify clean working directory
git status
# Should show: "working tree clean"

# Verify .gitignore is working
git check-ignore .next/
# Should return: .next/

# Check branch organization
git branch -a
# Should show organized branch structure
```

## Future Development

### Adding New Features
1. **Create feature branch**: `git checkout -b feature/new-feature-name`
2. **Develop and test** your changes
3. **Commit incrementally** with good messages
4. **Push to remote**: `git push -u origin feature/new-feature-name`
5. **Create Pull Request** (if using GitHub/GitLab)
6. **Merge when ready**: Back to main and merge
7. **Clean up**: Delete feature branch after merging

### Maintenance Tasks
```bash
# Regularly clean up merged branches
git branch --merged | grep -v "\*\|main" | xargs -n 1 git branch -d

# Keep .gitignore updated for new file types
git add .gitignore
git commit -m "chore: update .gitignore for new dependencies"

# Regular housekeeping
git gc --prune=now  # Clean up repository
git remote prune origin  # Remove stale remote references
```

## Emergency Procedures

### If You Need to Undo Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo changes to specific file
git checkout -- <filename>

# Restore file from specific commit
git checkout <commit-hash> -- <filename>
```

### If Git Gets Messy
```bash
# See what happened
git reflog

# Create backup branch
git checkout -b backup-before-cleanup

# Reset to known good state
git checkout main
git reset --hard origin/main
```

## Summary

This project demonstrates the evolution from chaotic development to organized Git workflow:

1. **Started**: All changes on main branch, mixed commits
2. **Organized**: Created feature branches for different types of work  
3. **Cleaned**: Removed build files, implemented proper .gitignore
4. **Standardized**: Established commit message conventions
5. **Documented**: This guide for future reference

The result is a clean, maintainable repository with clear separation between stable code and experimental features, ready for collaborative development or future enhancements.
