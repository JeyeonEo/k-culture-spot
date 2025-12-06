# CLAUDE.md - AI Assistant Guide for HypeSpot

## Project Overview

**HypeSpot** is a Python project for Korean culture discovery and exploration. This repository is in its early stages of development.

- **License**: MIT License
- **Author**: jeyeon.eo
- **Language**: Python

## Repository Structure

```
hypespot/
├── .gitignore          # Python-specific gitignore
├── LICENSE             # MIT License
├── README.md           # Project readme
└── CLAUDE.md           # This file - AI assistant guide
```

## Development Setup

### Prerequisites
- Python 3.9+ recommended
- Virtual environment (venv, uv, or poetry)

### Environment Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # Linux/macOS
# or
.venv\Scripts\activate     # Windows

# Install dependencies (when requirements.txt exists)
pip install -r requirements.txt

# Or with uv (if available)
uv venv
uv pip install -r requirements.txt
```

## Code Style & Conventions

### Python Style Guidelines
- Follow PEP 8 style guide
- Use type hints for function signatures
- Maximum line length: 88 characters (Black formatter default)
- Use docstrings for modules, classes, and functions

### Naming Conventions
- **Files/Modules**: `snake_case.py`
- **Classes**: `PascalCase`
- **Functions/Variables**: `snake_case`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private members**: prefix with `_`

### Import Order
1. Standard library imports
2. Third-party imports
3. Local application imports

Separate each group with a blank line.

## Testing

```bash
# Run tests (when configured)
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_example.py
```

## Linting & Formatting

```bash
# Format code with Black (when configured)
black .

# Lint with Ruff (when configured)
ruff check .

# Type checking with mypy (when configured)
mypy .
```

## Git Workflow

### Branch Naming
- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Claude AI branches: `claude/<session-id>`

### Commit Message Format
- Use imperative mood: "Add feature" not "Added feature"
- Keep first line under 50 characters
- Add detailed description after blank line if needed

### Before Committing
1. Ensure all tests pass
2. Run linter and fix issues
3. Format code consistently

## AI Assistant Guidelines

### When Making Changes
1. **Read before editing**: Always read files before making modifications
2. **Understand context**: Explore related files to understand the codebase
3. **Minimal changes**: Make focused changes that address the specific task
4. **Test your changes**: Run tests after making modifications
5. **No over-engineering**: Avoid adding unnecessary abstractions or features

### File Operations
- Prefer editing existing files over creating new ones
- Keep changes focused and atomic
- Maintain existing code style and patterns

### Documentation
- Update docstrings when changing function signatures
- Do not create documentation files unless explicitly requested
- Keep comments concise and meaningful

### Security Considerations
- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Validate user inputs appropriately
- Be mindful of SQL injection, XSS, and other OWASP vulnerabilities

## Project-Specific Notes

### Admin Account Management

The project includes a CLI script to create the first admin account:

```bash
# From project root
python scripts/create_admin.py
```

This script:
- Creates a user with ADMIN role directly
- Prompts for email, password (min 6 chars), and optional name
- Initializes the database if needed
- Sets the account as verified and active

**Location**: `scripts/create_admin.py`

### Future Development Areas
As this project develops, this section should be updated with:
- API endpoints and their purposes
- Data models and schemas
- External service integrations
- Configuration options

### Dependencies
Track major dependencies here as they are added:
- (No dependencies yet)

## Quick Reference

| Task | Command |
|------|---------|
| Create venv | `python -m venv .venv` |
| Activate venv | `source .venv/bin/activate` |
| Install deps | `pip install -r requirements.txt` |
| Run tests | `pytest` |
| Format code | `black .` |
| Lint code | `ruff check .` |

---

*This document should be updated as the project evolves with new conventions, dependencies, and workflows.*
