# 电子签证申请系统

这是一个使用Next.js构建的电子签证申请系统，支持多申请人、照片上传和支付选项。

## 功能特点

- 电子签证申请表单
- 支持多个申请人
- 照片上传和预览
- 支付选项（现在支付/稍后支付）
- 表单验证
- 通过电子邮件发送申请信息

## 环境变量设置

在项目根目录创建一个`.env.local`文件，并添加以下环境变量：

```
EMAIL_USER=your_protonmail_email@protonmail.com
EMAIL_PASS=your_protonmail_password_or_app_specific_password
PROTONMAIL_ADDRESS=your_protonmail_email@protonmail.com
```

### ProtonMail SMTP 设置

本项目使用ProtonMail的SMTP服务发送邮件，相关设置如下：

- SMTP主机: smtp.protonmail.ch
- 端口: 587
- 认证方式: PLAIN或LOGIN
- 加密: STARTTLS

## 开始使用

首先，安装依赖：

```bash
npm install
```

然后，运行开发服务器：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
