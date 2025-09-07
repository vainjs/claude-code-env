# Claude Code Env (CCE)

[![NPM version](https://img.shields.io/npm/v/@vainjs/claude-code-env.svg?style=flat)](https://npmjs.org/package/@vainjs/claude-code-env) [![NPM downloads](http://img.shields.io/npm/dm/@vainjs/claude-code-env.svg?style=flat)](https://npmjs.org/package/@vainjs/claude-code-env)

简体中文 ｜ [English](./README.md)

你是否厌倦了手动编辑环境变量来切换不同的模型？如果你不想使用 `claude-code-router`，那么 `CCE` 是一个不错的选择，它是一个轻便的命令行工具，让你能够通过简单的命令去管理和切换各种 Anthropic 接口规范的大模型。

## 为什么用 CCE？

`CCE` 解决了使用 `Claude Code` 时常见的烦恼：

- ✅ **多个模型** - 在官方 API、代理服务器和企业网络之间快速切换。
- ✅ **环境变量** - 避免频繁编辑 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_AUTH_TOKEN` 等环境变量。
- ✅ **团队协作** - 轻松与团队共享和同步配置。

## 它和 claude-code-router 有什么不同？

需要说明的是，`CCE` **不是代理工具也不是请求路由器**。它就是个客户端环境变量切换器，唯一的工作就是帮你管理和设置终端会话的环境变量（`ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN` 等）。它不会去拦截或转发你的任何请求。这样也就意味着它指向的模型服务（不管是官方 API、第三方代理还是其他服务）必须兼容 Anthropic API 规范。

## 快速安装

```bash
pnpm add -g @vainjs/claude-code-env
```

## 核心功能

### 一键配置

添加新模型很简单：

```bash
cce add # 会提示你输入模型名称、地址、令牌等
```

随时切换模型：

```bash
cce use claude
```

### 配置一目了然

查看配置列表：

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

### 实时状态检查

确认你实际使用的环境变量：

```bash
cce status
```

### 管理不同模型的配置

```bash
# 添加官方 API
cce add
# 名称：claude，地址：https://api.anthropic.com

# 添加第三方服务
cce add
# 名称：kimi-k2，地址：https://api.siliconflow.cn

# 快速切换
cce use claude
cce use kimi-k2
```

### 环境变量管理

CCE 现在支持动态环境变量管理，允许你自定义切换模型时使用的环境变量。

#### 查看环境变量

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

#### 添加自定义环境变量

```bash
cce env add CUSTOM_HEADER
```

#### 删除环境变量

```bash
cce env remove  # 交互式选择可删除的变量
```

**注意**：必需的环境变量（`ANTHROPIC_BASE_URL` 和 `ANTHROPIC_AUTH_TOKEN`）无法删除，因为它们对 API 功能至关重要。

## 配置结构

所有配置都保存在 `~/.claude-code-env.json` 文件，格式如下：

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
