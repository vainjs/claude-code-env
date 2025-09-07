# Claude Code Env (CCE)

[![NPM version](https://img.shields.io/npm/v/@vainjs/claude-code-env.svg?style=flat)](https://npmjs.org/package/@vainjs/claude-code-env) [![NPM downloads](http://img.shields.io/npm/dm/@vainjs/claude-code-env.svg?style=flat)](https://npmjs.org/package/@vainjs/claude-code-env)

English ｜ [简体中文](./README-zh_CN.md)

Are you tired of manually editing environment variables to switch between different models? If you don't want to use `claude-code-router`,
then `CCE` is a great choice. It's a lightweight command-line tool that allows you to manage and switch between various large models that
comply with the Anthropic API specification through simple commands.

## Why use CCE?

`CCE` solves common pain points when using `Claude Code`:

- ✅ **Multiple models** - Quickly switch between official APIs, proxy servers, and enterprise networks.
- ✅ **Environment variables** - Avoid frequently editing environment variables like `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`.
- ✅ **Team collaboration** - Easily share and sync configurations with your team.

## How is it different from claude-code-router?

It should be noted that `CCE` **is not a proxy tool or request router**. It's just a client-side environment variable switcher, whose only job is
to help you manage and set environment variables (`ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, etc.) for your terminal session. It doesn't
intercept or forward any of your requests. This also means that the model service it points to (whether it's the official API, third-party
proxy, or other services) must be compatible with the Anthropic API specification.

## Install

```bash
pnpm add -g @vainjs/claude-code-env
```

## Core Features

### One-command Configuration

Adding a new model is simple:

```bash
cce add # Will prompt you to enter model name, address, token, etc.
```

Switch models anytime:

```bash
cce use claude
```

### Clear Configuration Overview

View configuration list:

```bash
cce list
```

```
■ Configured Models

  NAME                     ANTHROPIC_MODEL
  ────────────────────────────────────────────────────────────
● claude                   Default
  kimi-k2                  moonshotai/Kimi-K2-Instruct

Current model: claude
```

### Real-time Status Check

Confirm the environment variables you're actually using:

```bash
cce status
```

### Managing Configurations for Different Models

```bash
# Add official API
cce add
# Name: claude, URL: https://api.anthropic.com

# Add third-party server
cce add
# Name: kimi-k2, URL: https://api.siliconflow.cn

# Quick switching
cce use claude
cce use kimi-k2
```

### Environment Variable Management

CCE now supports dynamic environment variable management, allowing you to customize which variables are used when switching models.

#### View Environment Variables

```bash
cce env
```

```
■ Environment Variables

  1. ANTHROPIC_BASE_URL (required)
  2. ANTHROPIC_AUTH_TOKEN (required)
  3. ANTHROPIC_MODEL
  4. ANTHROPIC_MAX_TOKENS

Commands:
  cce env add <key>    - Add environment variable
  cce env remove       - Remove environment variable
```

#### Add Custom Environment Variables

```bash
cce env add CUSTOM_HEADER
```

#### Remove Environment Variables

```bash
cce env remove  # Interactive selection of removable variables
```

**Note**: Required environment variables (`ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`) cannot be removed as they are essential for API functionality.

## Supported Shells

CCE supports the following shells and automatically detects your current shell:

- ✅ **Bash** - Uses `~/.bashrc`
- ✅ **Zsh** - Uses `~/.zshrc`
- ✅ **Fish** - Uses `~/.config/fish/config.fish`

## Configuration Structure

All configurations are saved in the `~/.claude-code-env.json` file with the following format:

```json
{
  "models": [
    {
      "name": "claude",
      "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
      "ANTHROPIC_AUTH_TOKEN": "sk-ant-xxx",
      "description": "official API"
    },
    {
      "name": "kimi-k2",
      "ANTHROPIC_BASE_URL": "https://api.siliconflow.cn",
      "ANTHROPIC_AUTH_TOKEN": "sk-mcki-xxx",
      "ANTHROPIC_MODEL": "moonshotai/Kimi-K2-Instruct"
    }
  ],
  "currentModel": "claude",
  "envVars": [
    { "key": "ANTHROPIC_BASE_URL", "required": true },
    { "key": "ANTHROPIC_AUTH_TOKEN", "required": true },
    { "key": "ANTHROPIC_MODEL", "required": false },
    { "key": "ANTHROPIC_MAX_TOKENS", "required": false }
  ]
}
```
