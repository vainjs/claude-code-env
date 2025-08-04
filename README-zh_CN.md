# 🚀 Claude Code Env (CCE)

简体中文 | [English](./README.md)

轻松管理多个 anthropic 规范的 API，可一键切换不同模型

## 🎯 为什么需要 CCE？

如果你在使用 Claude Code 时遇到过这些问题：

- ✅ **多个 API 端点管理困难** - 需要在官方 API、代理服务器、企业内网之间切换
- ✅ **环境变量设置繁琐** - 每次切换都要手动修改 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_AUTH_TOKEN`
- ✅ **配置容易出错** - 手动复制粘贴 token 和 URL 容易出错
- ✅ **团队协作困难** - 无法快速分享和同步配置

那么 CCE 就是你需要的解决方案！

## ⚡ 核心特性

#### 一键配置管理

```bash
# 添加新配置只需一条命令
cce add

# 瞬间切换到任意配置
cce use claude
```

#### 直观的配置列表

```bash
cce list
```

```
■ Configured Models

  NAME                     ANTHROPIC_MODEL
  ────────────────────────────────────────────────────────────
● claude-official          Default
  claude-proxy             claude-3-5-sonnet-20241022
  claude-enterprise        Default

Current model: claude-official
```

#### 实时状态监控

```bash
cce status
```

查看当前配置详情和环境变量状态

## 💡 典型使用场景

#### 官方 API + 代理服务器

```bash
# 添加官方 API
cce add
# Name: claude-official
# ANTHROPIC_BASE_URL: https://api.anthropic.com
# ANTHROPIC_AUTH_TOKEN: sk-ant-xxx

# 添加代理服务器
cce add
# Name: claude-proxy
# ANTHROPIC_BASE_URL: https://your-proxy.com/v1
# ANTHROPIC_AUTH_TOKEN: your-proxy-token

# 快速切换
cce use claude-proxy    # 使用代理
cce use claude-official # 使用官方
```

#### 不同模型配置

```bash
# Sonnet 模型配置
cce add
# Name: sonnet
# ANTHROPIC_MODEL: claude-3-5-sonnet-20241022

# Haiku 模型配置
cce add
# Name: haiku
# ANTHROPIC_MODEL: claude-3-5-haiku-20241022

# 根据任务选择模型
cce use sonnet  # 复杂任务
cce use haiku   # 简单任务
```

## 📁 配置文件结构

CCE 将所有配置保存在 `~/.claude-code-env.json`:

```json
{
  "models": [
    {
      "name": "claude-official",
      "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
      "ANTHROPIC_AUTH_TOKEN": "sk-ant-xxx",
      "description": "官方 API"
    },
    {
      "name": "claude-proxy",
      "ANTHROPIC_BASE_URL": "https://your-proxy.com/v1",
      "ANTHROPIC_AUTH_TOKEN": "proxy-token",
      "ANTHROPIC_MODEL": "claude-3-5-sonnet-20241022",
      "description": "代理服务器"
    }
  ],
  "currentModel": "claude-official"
}
```
