# Git Security Audit Guide
*A comprehensive guide to auditing Git repositories for sensitive information*

## 🔒 Overview

This guide provides step-by-step instructions for conducting thorough security audits of Git repositories to identify and prevent exposure of sensitive information like passwords, API keys, tokens, and other credentials.

## 🎯 Why Security Audits Matter

**Common Security Risks:**
- API keys and tokens committed accidentally
- Database passwords in configuration files
- Authentication credentials in source code
- Environment variables with sensitive data
- Private keys or certificates
- Internal URLs and endpoints

**Consequences of Exposure:**
- Unauthorized access to systems
- Data breaches
- Financial losses
- Compliance violations
- Reputation damage

## 🛠️ Prerequisites

**Required Tools:**
- Git (command line)
- Terminal/Command Prompt
- Text editor (optional, for reviewing findings)

**Required Knowledge:**
- Basic Git commands
- Command line navigation
- Understanding of sensitive data types

## 📋 Complete Audit Checklist

### Phase 1: Repository Preparation
- [ ] Navigate to repository directory
- [ ] Ensure all branches are available locally
- [ ] Verify Git history is complete
- [ ] Document current branch and status

### Phase 2: Commit Message Analysis
- [ ] Search commit messages for sensitive keywords
- [ ] Review suspicious commit messages
- [ ] Document findings

### Phase 3: File Content Analysis
- [ ] Search file contents across all commits
- [ ] Examine detected files individually
- [ ] Verify false positives vs real issues

### Phase 4: Historical Change Analysis
- [ ] Search for specific content changes
- [ ] Review file additions and modifications
- [ ] Check for deleted sensitive files

### Phase 5: Documentation and Remediation
- [ ] Document all findings
- [ ] Create remediation plan if needed
- [ ] Update security practices

## 🔍 Step-by-Step Audit Commands

### 1. Initial Repository Assessment

```bash
# Check current status and branch
git status
git branch -a

# Get repository overview
git log --oneline --graph --all --decorate | head -20

# Count total commits
git rev-list --all --count
```

### 2. Commit Message Security Scan

```bash
# Search commit messages for sensitive keywords
git log --all --full-history --grep="password\|secret\|key\|token\|api\|auth\|credential" --oneline

# More specific searches
git log --all --grep="password" --oneline
git log --all --grep="secret" --oneline  
git log --all --grep="api.key\|apikey\|api_key" --oneline
git log --all --grep="token" --oneline
git log --all --grep="credential\|login\|auth" --oneline

# Case-insensitive search
git log --all -i --grep="PASSWORD\|SECRET\|TOKEN" --oneline
```

### 3. File Content Historical Analysis

```bash
# Search for sensitive content across all commits and files
git rev-list --all | xargs git grep -l -i -E "(password|secret|key|token|api|auth|credential)" 2>/dev/null || echo "✅ No sensitive strings found"

# Search for specific patterns in file content changes
git log --all -p -S "password" --source --all
git log --all -p -S "secret" --source --all
git log --all -p -S "api_key" --source --all
git log --all -p -S "token" --source --all

# Search for environment variables
git log --all -p -S "REACT_APP_" --source --all
git log --all -p -S "NODE_ENV" --source --all
```

### 4. Pattern-Specific Searches

```bash
# Search for common sensitive patterns
git log --all -p -S "mongodb://" --source --all
git log --all -p -S "postgres://" --source --all
git log --all -p -S "mysql://" --source --all
git log --all -p -S "redis://" --source --all
git log --all -p -S "ftp://" --source --all
git log --all -p -S "sftp://" --source --all

# Search for key file extensions
git log --all --name-only --pretty=format: | grep -E "\.(pem|key|p12|pfx|jks)$" | sort | uniq

# Search for common config files that might contain secrets
git log --all --name-only --pretty=format: | grep -E "(\.env|config\.json|secrets\.yaml|credentials)" | sort | uniq
```

### 5. Advanced Content Analysis

```bash
# Search for email patterns (might indicate credentials)
git log --all -p --grep="@.*\.(com|org|net|gov)" --oneline

# Search for IP addresses (might be internal/sensitive)
git log --all -p -G "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" --oneline

# Search for URL patterns
git log --all -p -G "https?://[^\s]+" --oneline

# Search for base64 encoded content (often used for keys)
git log --all -p -G "[A-Za-z0-9+/]{40,}={0,2}" --oneline
```

### 6. File Addition/Deletion Analysis

```bash
# Check for deleted files that might have contained secrets
git log --all --diff-filter=D --summary | grep delete

# Check for large file additions (might be binary keys/certificates)
git log --all --stat | grep -E "^\s+[^|]+\|\s+[0-9]{3,}\s+\++"

# Check for specific file types being added
git log --all --name-status | grep -E "A\s+.*\.(pem|key|p12|pfx|jks|crt|cer)$"
```

## 🔍 Manual Investigation Commands

### Examining Specific Commits

```bash
# Show full details of a suspicious commit
git show <commit-hash>

# Show only the files changed in a commit
git show --name-only <commit-hash>

# Show the diff for a specific file in a commit
git show <commit-hash>:<file-path>

# Compare a file across commits
git diff <commit1> <commit2> -- <file-path>
```

### Examining Specific Files

```bash
# Show file content at a specific commit
git show <commit-hash>:<file-path>

# Show all changes to a specific file
git log -p --follow -- <file-path>

# Show when a file was deleted
git log --follow --all -- <file-path>
```

## 🚨 Common False Positives

**Legitimate matches to ignore:**
- Package names containing "key" (e.g., "keyboard", "keyframe")
- CSS properties (e.g., "key", "animation-key")
- JavaScript object keys
- Documentation mentioning "password" or "secret"
- Test files with dummy credentials
- Framework-generated code

**How to verify:**
```bash
# Check the actual content of detected files
git show <commit-hash>:<file-path> | head -20

# Look for patterns that indicate real vs fake credentials
grep -E "password.*=.*['\"][^'\"]{8,}" <file>
grep -E "api.key.*=.*['\"][A-Za-z0-9]{20,}" <file>
```

## 🛡️ Sensitive Patterns to Look For

### High-Risk Patterns

```bash
# API Keys and Tokens
- "api_key": "sk_live_..."
- "token": "ghp_..."
- "secret": "aws_secret_..."
- "password": "realpassword123"

# Database Connection Strings
- "mongodb://username:password@host"
- "postgres://user:pass@localhost"
- "mysql://root:secret@db"

# Environment Variables
- REACT_APP_API_KEY=live_key_123
- AWS_SECRET_ACCESS_KEY=secret123
- DATABASE_PASSWORD=mypass
```

### Medium-Risk Patterns

```bash
# Configuration Files
- .env files with real values
- config.json with credentials
- docker-compose.yml with passwords

# URLs with Credentials
- https://user:pass@api.service.com
- ftp://admin:secret@internal.server
```

## 📊 Audit Report Template

```markdown
# Git Security Audit Report

**Repository:** [repository-name]
**Audit Date:** [date]
**Auditor:** [your-name]
**Branches Examined:** [list of branches]

## Executive Summary
- Total commits examined: [number]
- Sensitive patterns searched: [number]
- Findings: [High/Medium/Low risk count]
- Overall Status: [CLEAN/ISSUES FOUND]

## Detailed Findings

### High Risk Issues
- [List any critical findings]

### Medium Risk Issues  
- [List moderate findings]

### Low Risk/False Positives
- [List investigated items that were deemed safe]

## Recommendations
- [List any actions needed]

## Verification Commands Used
- [List the main commands used for verification]
```

## 🔧 Remediation Steps

### If Sensitive Data is Found

**Immediate Actions:**
1. **DO NOT** push to remote repositories
2. Document the exact location and nature of sensitive data
3. Rotate/invalidate any exposed credentials immediately

**Git History Cleanup:**
```bash
# For recent commits (not pushed)
git reset --soft HEAD~1  # Go back 1 commit, keep changes
git reset --hard HEAD~1  # Go back 1 commit, discard changes

# For commits in history (DANGEROUS - rewrites history)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch <sensitive-file>' --prune-empty --tag-name-filter cat -- --all

# Alternative: Use BFG Repo-Cleaner (recommended for large repos)
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files <sensitive-file> .
```

**Prevention Measures:**
1. Update `.gitignore` to exclude sensitive file types
2. Implement pre-commit hooks
3. Use environment variables for sensitive data
4. Regular security audits
5. Team security training

## 🔄 Automation Options

### Pre-commit Hook Example

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Basic security check before commits

echo "Running security check..."

# Check for common sensitive patterns
if git diff --cached --name-only | xargs grep -l -E "(password|secret|key|token)" 2>/dev/null; then
    echo "❌ Potential sensitive data detected!"
    echo "Files containing sensitive patterns:"
    git diff --cached --name-only | xargs grep -l -E "(password|secret|key|token)" 2>/dev/null
    echo "Please review and remove sensitive data before committing."
    exit 1
fi

echo "✅ Security check passed"
```

### Regular Audit Script

Create `audit.sh`:
```bash
#!/bin/bash
# Automated security audit script

echo "🔒 Starting Git Security Audit..."

# Create audit directory
mkdir -p security-audit
cd security-audit

# Run basic checks
echo "📋 Checking commit messages..."
git log --all --grep="password\|secret\|key\|token" --oneline > commit-messages.txt

echo "📋 Checking file contents..."
git rev-list --all | xargs git grep -l -E "(password|secret|key|token)" > file-contents.txt 2>/dev/null

echo "📋 Checking for sensitive files..."
git log --all --name-only | grep -E "\.(pem|key|env)$" > sensitive-files.txt

echo "✅ Audit complete. Check security-audit/ directory for results."
```

## 📚 Best Practices

### Development Practices
1. **Never commit secrets** - Use environment variables
2. **Use .gitignore** - Exclude sensitive file types
3. **Regular audits** - Monthly or before major releases  
4. **Team training** - Educate developers on security
5. **Automated checks** - Implement pre-commit hooks

### Repository Management
1. **Branch protection** - Require reviews for sensitive branches
2. **Access control** - Limit who can push to main branches
3. **Audit logging** - Track who accesses the repository
4. **Regular cleanup** - Remove unnecessary historical data

### Tools and Services
- **GitHub Advanced Security** - Automated secret scanning
- **GitLab Secret Detection** - Built-in security scanning
- **TruffleHog** - Git history secret scanner
- **BFG Repo-Cleaner** - Repository cleanup tool
- **git-secrets** - AWS secret prevention tool

## 🆘 Emergency Response

### If Secrets Are Already Public

**Immediate Actions (First Hour):**
1. Rotate all exposed credentials immediately
2. Revoke API keys and tokens
3. Change passwords
4. Notify security team
5. Monitor for unauthorized access

**Short-term Actions (First Day):**
1. Clean Git history if possible
2. Force push cleaned history (if repository allows)
3. Notify team members to re-clone repository
4. Update all systems using the exposed credentials
5. Review access logs for suspicious activity

**Long-term Actions (First Week):**
1. Implement stricter security measures
2. Conduct thorough security audit
3. Update team security training
4. Improve automated security checks
5. Document lessons learned

## 📞 Support Resources

- **Git Documentation:** https://git-scm.com/docs
- **GitHub Security:** https://docs.github.com/en/code-security
- **GitLab Security:** https://docs.gitlab.com/ee/security/
- **OWASP Git Security:** https://owasp.org/www-project-devsecops-guideline/

---

**Remember:** Security is an ongoing process, not a one-time check. Regular audits help maintain repository security and protect sensitive information.
