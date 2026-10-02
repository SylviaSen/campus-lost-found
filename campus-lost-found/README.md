# 校园失物招领

一个基于 Vue 3 + Supabase 的校园失物招领平台，支持用户注册登录、发布失物/招领信息、图片上传、列表浏览、详情查看、个人管理等功能。

## 技术栈

- 前端：Vue 3 + Vite + TypeScript
- UI：Element Plus
- 后端/数据库：Supabase（Auth + PostgreSQL + Storage）
- 部署：Vercel
- 版本控制：Git + GitHub

## 功能

- 用户注册 / 登录 / 退出
- 发布失物 / 招领信息（支持图片上传）
- 首页列表：按时间倒序、类型筛选、标题/描述搜索
- 详情页：图片、联系方式一键复制
- 我的发布：修改状态、删除
- 权限控制：所有人可读，登录可发，只能改/删自己的

## 本地运行

```bash
npm install
npm run dev

## 项目结构
src/
  lib/          # Supabase 客户端、工具函数
  router/       # 路由配置
  views/        # 页面
    Home.vue      # 首页列表
    Publish.vue   # 发布
    Detail.vue    # 详情
    Mine.vue      # 我的发布
    Login.vue     # 登录/注册
  App.vue       # 根组件
  main.ts       # 入口

## 作者
SylviaSen