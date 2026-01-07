# CLAUDE.md - AI Assistant Development Guide

> **Last Updated**: 2026-01-07
> **Repository**: iamxianhua/helloWorld
> **Purpose**: Guide for AI assistants working with this codebase

---

## 📋 Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflows](#development-workflows)
4. [Code Conventions](#code-conventions)
5. [Git Workflow](#git-workflow)
6. [Testing Strategy](#testing-strategy)
7. [AI Assistant Guidelines](#ai-assistant-guidelines)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Repository Overview

### Project Status
**Current State**: New repository initialization phase

This is a fresh repository currently being set up. As the codebase evolves, this section should be updated with:
- Project purpose and goals
- Target audience or use cases
- Technology stack
- Key dependencies

### Quick Start
```bash
# Clone the repository
git clone http://127.0.0.1:37455/git/iamxianhua/helloWorld
cd helloWorld

# Install dependencies (update when package manager is chosen)
# npm install / pip install -r requirements.txt / go mod download

# Run the project (update when build system is established)
# npm start / python main.py / go run main.go
```

---

## 📁 Codebase Structure

### Current Directory Layout
```
helloWorld/
├── .git/                    # Git repository metadata
└── CLAUDE.md               # This file
```

### Planned Structure (Update as project grows)
```
helloWorld/
├── .git/                    # Git repository metadata
├── src/                     # Source code
│   ├── main.*              # Entry point
│   ├── lib/                # Core libraries
│   └── utils/              # Utility functions
├── tests/                   # Test files
├── docs/                    # Documentation
├── config/                  # Configuration files
├── scripts/                 # Build and deployment scripts
├── .gitignore              # Git ignore patterns
├── README.md               # Project overview
├── CLAUDE.md               # AI assistant guide (this file)
└── LICENSE                 # License information
```

### Key Files (To be added)
- **README.md**: User-facing documentation
- **LICENSE**: Legal terms
- **.gitignore**: Files to exclude from version control
- **Package manager file**: Dependencies definition

---

## 🔄 Development Workflows

### Branch Strategy
- **Main/Master Branch**: Production-ready code
- **Development Branch**: Integration branch for features
- **Feature Branches**: Named as `claude/<description>-<session-id>`
  - Example: `claude/add-claude-documentation-NFXic`
  - Must start with `claude/` and end with session ID for CI/CD compatibility

### Making Changes
1. **Always read files before editing**: Use Read tool before making changes
2. **Understand context**: Review related files to understand dependencies
3. **Make focused changes**: Only modify what's necessary for the task
4. **Test changes**: Verify functionality after modifications
5. **Commit with clear messages**: Explain what and why

### Build Process (To be defined)
```bash
# Update this section when build system is implemented
# Examples:
# npm run build
# make build
# go build
```

### Testing (To be defined)
```bash
# Update this section when tests are added
# Examples:
# npm test
# pytest
# go test ./...
```

---

## 📝 Code Conventions

### General Principles
1. **Simplicity First**: Avoid over-engineering
2. **Clarity Over Cleverness**: Code should be self-documenting
3. **Minimal Abstraction**: Don't create abstractions for single-use cases
4. **Security-Conscious**: Prevent common vulnerabilities (XSS, SQL injection, etc.)

### Naming Conventions (Update based on chosen language)
- **Variables**: `camelCase` or `snake_case` (define based on language)
- **Functions**: Descriptive verb-noun combinations
- **Classes**: `PascalCase` for class names
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: Consistent with project language conventions

### Code Style (To be defined)
- **Indentation**: Spaces vs tabs (define when language is chosen)
- **Line length**: Maximum characters per line
- **Comments**: Only when logic isn't self-evident
- **Error handling**: At system boundaries (user input, external APIs)

### Security Guidelines
- Never commit secrets, API keys, or credentials
- Validate input at system boundaries
- Use parameterized queries for databases
- Sanitize user input displayed in UI
- Follow OWASP Top 10 guidelines

---

## 🌿 Git Workflow

### Branch Naming
```
claude/<feature-description>-<session-id>
```

### Commit Message Format
```
<type>: <concise description>

[Optional detailed explanation focusing on WHY]

Examples:
feat: add user authentication system
fix: resolve race condition in data processing
docs: update CLAUDE.md with testing guidelines
refactor: simplify error handling in API layer
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code restructuring without behavior change
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Git Operations Best Practices

#### Pushing Changes
```bash
# Always use -u flag for new branches
git push -u origin <branch-name>

# Branch must start with 'claude/' and end with session ID
# Retry logic: If push fails due to network, retry up to 4 times
# with exponential backoff (2s, 4s, 8s, 16s)
```

#### Fetching Updates
```bash
# Prefer fetching specific branches
git fetch origin <branch-name>

# Use same retry logic as push for network failures
```

### Pre-commit Checks
- Ensure no secrets are committed
- Verify code follows conventions
- Run linters if configured
- Ensure tests pass

---

## 🧪 Testing Strategy

### Testing Principles (To be implemented)
1. **Test at boundaries**: User input, external APIs, database interactions
2. **No testing internal code**: Trust framework guarantees
3. **Meaningful assertions**: Test actual behavior, not implementation
4. **Keep tests simple**: Don't over-engineer test infrastructure

### Test Structure (Update when implemented)
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/           # End-to-end tests
```

---

## 🤖 AI Assistant Guidelines

### Before Making Changes
1. ✅ **READ files first**: Never propose changes to unread code
2. ✅ **Use TodoWrite**: Plan and track multi-step tasks
3. ✅ **Search efficiently**: Use Task tool with Explore agent for codebase exploration
4. ✅ **Understand context**: Review related files and dependencies

### When Writing Code
1. ✅ **Avoid over-engineering**: Only add what's requested
2. ✅ **No premature optimization**: Solve current problem, not hypothetical futures
3. ✅ **Security first**: Prevent common vulnerabilities
4. ✅ **Keep it simple**: Three lines of similar code beats premature abstraction
5. ❌ **Don't add unnecessary features**: No unrequested error handling, logging, etc.
6. ❌ **Don't refactor unrelated code**: Stay focused on the task
7. ❌ **Don't add comments to unchanged code**: Only comment new logic when necessary

### When Committing
1. ✅ **Stage relevant files**: Only add files related to current task
2. ✅ **Write clear messages**: Focus on WHY, not WHAT
3. ✅ **Check for secrets**: Never commit credentials
4. ✅ **Follow commit message format**: Use conventional commit types
5. ❌ **Don't commit generated files**: Update .gitignore appropriately

### Tool Usage Preferences
- **File search**: Use Task tool with Explore agent, not Grep/Glob directly
- **Reading files**: Use Read tool, not `cat` via Bash
- **Editing files**: Use Edit tool, not `sed`/`awk` via Bash
- **Parallel operations**: Make multiple independent tool calls in single message
- **Communication**: Output text directly, never use `echo` or comments

### Creating Pull Requests
1. Analyze ALL commits in the branch (not just latest)
2. Draft clear PR summary with bullet points
3. Include test plan checklist
4. Use format:
   ```markdown
   ## Summary
   - Key change 1
   - Key change 2

   ## Test plan
   - [ ] Test case 1
   - [ ] Test case 2
   ```

---

## 🔧 Common Tasks

### Adding a New Feature
1. Create feature branch: `claude/add-<feature>-<session-id>`
2. Use TodoWrite to plan implementation steps
3. Read relevant existing files
4. Implement changes incrementally
5. Test functionality
6. Commit with clear message
7. Push to feature branch
8. Create pull request if requested

### Fixing a Bug
1. Read the file(s) with the bug
2. Understand the root cause
3. Make minimal fix without refactoring
4. Test the fix
5. Commit: `fix: <description of bug>`

### Updating Documentation
1. Read existing documentation
2. Make focused updates
3. Ensure consistency with codebase
4. Commit: `docs: <what was updated>`

### Refactoring Code
1. Only refactor when explicitly requested
2. Ensure tests pass before and after
3. Make incremental changes
4. Commit: `refactor: <what was simplified>`

---

## 🔍 Troubleshooting

### Common Issues

#### Git Push Fails with 403
- **Cause**: Branch doesn't follow naming convention
- **Solution**: Ensure branch starts with `claude/` and ends with session ID

#### Network Failures During Git Operations
- **Solution**: Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s)

#### Pre-commit Hook Blocks Commit
- **Check**: Review hook feedback in the response
- **Adjust**: Modify changes according to hook requirements
- **If stuck**: Ask user to check hooks configuration

#### Can't Find Files
- **Use Glob**: Pattern matching for file discovery
- **Use Grep**: Content search within files
- **Use Task + Explore**: For exploratory codebase understanding

---

## 📚 Additional Resources

### Documentation Files (To be added)
- **README.md**: Project overview and quick start
- **CONTRIBUTING.md**: Contribution guidelines
- **API.md**: API documentation
- **ARCHITECTURE.md**: System design and architecture

### External References (Update as dependencies are added)
- Official documentation for frameworks used
- Style guides for chosen programming language
- Security best practices (OWASP)

---

## 🔄 Maintenance

### Updating This Document
This file should be updated when:
- Project structure changes significantly
- New development workflows are established
- Code conventions are defined or modified
- New tools or dependencies are added
- Common issues and solutions are identified

### Review Schedule
- Review after major architectural changes
- Update when new team members (AI or human) join
- Quarterly review for accuracy and completeness

---

## 📞 Getting Help

### For AI Assistants
- Use Task tool with `claude-code-guide` agent for Claude Code questions
- Reference official documentation at https://github.com/anthropics/claude-code
- Report issues at https://github.com/anthropics/claude-code/issues

### For Human Developers
- Check README.md for project-specific guidance
- Review this file for AI assistant behavior expectations
- Consult project documentation in docs/ directory

---

*This document is a living guide that evolves with the project. Keep it updated as the codebase grows and workflows mature.*
