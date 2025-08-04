# 🚀 Claude Code Env (CCE)

English ｜ [简体中文](./README-zh_CN.md)

Easily manage multiple anthropic specification model apis and switch between models with one command

## 🎯 Why CCE?

Solve these common Claude Code challenges:

- ✅ **Multiple API endpoints** - Switch between official API, proxy servers, and enterprise networks
- ✅ **Environment variable hassles** - No more manual editing of `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`
- ✅ **Configuration errors** - Eliminate copy-paste mistakes with tokens and URLs
- ✅ **Team collaboration** - Share and sync configurations easily

## ⚡ Core Features

#### One-Command Configuration

```bash
# Add new configuration
cce add

# Instantly switch to any configuration
cce use claude
```

#### Clear Configuration Overview

```bash
cce list
```

```
■ Configured Models

  NAME                     ANTHROPIC_MODEL
  ────────────────────────────────────────────────────────────
● claude-official          Default
  claude-proxy              claude-3-5-sonnet-20241022
  claude-enterprise         Default

Current model: claude-official
```

#### Real-time Status Monitoring

```bash
cce status  # View current configuration and environment variables
```

## 💡 Use Cases

#### Official API + Proxy Server

```bash
# Add official API
cce add
# Name: claude-official, URL: https://api.anthropic.com

# Add proxy server
cce add
# Name: claude-proxy, URL: https://your-proxy.com/v1

# Quick switching
cce use claude-proxy    # Use proxy
cce use claude-official # Use official
```

#### Different Model Configurations

```bash
# Sonnet for complex tasks
cce add  # Name: sonnet, Model: claude-3-5-sonnet-20241022

# Haiku for simple tasks
cce add  # Name: haiku, Model: claude-3-5-haiku-20241022

cce use sonnet  # Complex tasks
cce use haiku   # Simple tasks
```

## 📁 Configuration Structure

All configurations stored in `~/.claude-code-env.json`:

```json
{
  "models": [
    {
      "name": "claude-official",
      "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
      "ANTHROPIC_AUTH_TOKEN": "sk-ant-xxx",
      "description": "Official API"
    },
    {
      "name": "claude-proxy",
      "ANTHROPIC_BASE_URL": "https://your-proxy.com/v1",
      "ANTHROPIC_AUTH_TOKEN": "proxy-token",
      "ANTHROPIC_MODEL": "claude-3-5-sonnet-20241022"
    }
  ]
}
```
