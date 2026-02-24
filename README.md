# SumBurst (数字爆发) - 吉卜力风格数学消除游戏

这是一个使用 React + Tailwind CSS + Vite 开发的吉卜力风格数学消除益智游戏。

## 游戏玩法
- 点击方块累加数值。
- 匹配屏幕上方显示的 **目标和**。
- **经典模式**：每次成功匹配后都会新增一行。
- **计时挑战**：倒计时结束时会自动新增一行。
- **注意**：不要让方块堆积到最顶端，否则游戏结束！

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

## 部署到 GitHub & Vercel

### 1. 发布到 GitHub

1. 在 GitHub 上创建一个新的仓库（不要初始化 README）。
2. 在本地项目根目录运行：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SumBurst Game"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

### 2. 部署到 Vercel

1. 登录 [Vercel](https://vercel.com/)。
2. 点击 **"Add New..."** -> **"Project"**。
3. 导入你刚刚创建的 GitHub 仓库。
4. Vercel 会自动识别这是一个 Vite 项目。
5. 点击 **"Deploy"**。
6. 部署完成后，你将获得一个访问链接！

## 技术栈
- **React 19**
- **Tailwind CSS 4**
- **Motion (Framer Motion)** - 动画效果
- **Lucide React** - 图标
- **Canvas Confetti** - 胜利特效
- **Vite** - 构建工具
