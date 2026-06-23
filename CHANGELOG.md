# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-23

### Added
- ESLint 8 configuration with TypeScript support (replaces deprecated TSLint)
- `.eslintrc.json` configuration file with Prettier and TypeScript plugin integration
- `pnpm-workspace.yaml` with security vulnerability overrides
- `lint` and `lint:fix` npm scripts for code linting and auto-fixing
- `pnpm-lock.yaml` for deterministic dependency resolution

### Changed
- **BREAKING**: Migrated from deprecated TSLint to ESLint 8
- **Package Manager**: Switched from npm to pnpm for better monorepo support and faster installs
- Code formatting: Added trailing commas to function parameters via Prettier
- Updated Jest from 28.1.1 to 30.4.2 with corresponding test matcher updates
- Updated ts-jest from 28.0.5 to 29.4.11
- Updated Prettier from 1.19.1 to 3.8.4 (breaking changes in formatting rules)
- Updated release-it from 16.1.3 to 20.2.0
- Updated @typescript-eslint packages to 6.21.0 (from 8.62.0 due to TypeScript 4.7.4 compatibility)
- Fixed Jest test matchers for v30 compatibility: `toBeCalledTimes()` → `toHaveBeenCalledTimes()`
- Improved code quality: prefixed unused variables with underscore (e.g., `_event`)

### Removed
- Deprecated tslint package
- Deprecated tslint-config-prettier package
- `tslint` npm script
- `package-lock.json` (switched to pnpm)
- `tslint.json` configuration file

### Fixed
- **Security**: Fixed 8 high-severity vulnerabilities in undici (TLS validation bypass, WebSocket DoS, CORS bypass, cache poisoning, Set-Cookie downgrade)
- **Security**: Fixed moderate-severity js-yaml quadratic-complexity DoS vulnerability
- **Security**: Fixed 3 high-severity minimatch ReDoS vulnerabilities (nested extglobs, repeated wildcards, non-adjacent GLOBSTAR)
- All 20 tests passing with Jest 30.x
- ESLint configuration properly handles Jest/test globals
- Build succeeds without TypeScript errors

### Dependencies
**Updated:**
- `@typescript-eslint/eslint-plugin`: 6.21.0
- `@typescript-eslint/parser`: 6.21.0
- `eslint`: 8.57.1 (deprecated but stable for TypeScript 4.7.4 compatibility)
- `eslint-config-prettier`: 10.1.8
- `eslint-plugin-prettier`: 5.5.6
- `jest`: 30.4.2
- `prettier`: 3.8.4
- `release-it`: 20.2.0
- `ts-jest`: 29.4.11
- `nodemon`: 3.0.1

**Security Patches (via overrides):**
- `undici`: >=7.28.0 (fixes 8 vulnerabilities)
- `js-yaml`: >=4.2.0 (fixes DoS vulnerability)
- `minimatch`: >=9.0.7 (fixes 3 ReDoS vulnerabilities)

## [0.4.3] - 2024-06-03

### Fixed
- Security vulnerabilities in lodash, tmp, and @octokit packages
- Updated release-it and @types/node for peer dependency compatibility

## [0.4.2] - Previous releases

See git history for details.
