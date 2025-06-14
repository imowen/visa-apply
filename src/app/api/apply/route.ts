import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// 配置邮件发送器
const transporter = nodemailer.createTransport({
  host: 'smtp.protonmail.ch', // ProtonMail SMTP服务器
  port: 587,
  secure: false, // 使用STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // 从环境变量获取ProtonMail账号
    pass: process.env.EMAIL_PASS, // 从环境变量获取ProtonMail密码
  },
  authMethod: 'PLAIN', // ProtonMail支持PLAIN或LOGIN认证方法
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 获取表单数据
    const startDate = formData.get('startDate') as string;
    const visaValidity = formData.get('visaValidity') as string;
    const entryPoint = formData.get('entryPoint') as string;
    const visaType = formData.get('visaType') as string;
    const processingTime = formData.get('processingTime') as string;
    const entryPurpose = formData.get('entryPurpose') as string;
    const accommodation = formData.get('accommodation') as string;
    const province = formData.get('province') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const paymentOption = formData.get('paymentOption') as string;
    
    // 收集申请人照片信息
    const applicantPhotos: { portrait?: File, passport?: File }[] = [];
    let index = 1;
    
    while (formData.get(`portraitPhoto${index}`) || formData.get(`passportPhoto${index}`)) {
      const portraitPhoto = formData.get(`portraitPhoto${index}`) as File | null;
      const passportPhoto = formData.get(`passportPhoto${index}`) as File | null;
      
      if (portraitPhoto || passportPhoto) {
        applicantPhotos.push({
          portrait: portraitPhoto || undefined,
          passport: passportPhoto || undefined
        });
      }
      
      index++;
    }
    
    // 构建邮件内容
    const mailSubject = `新的电子签证申请 - ${paymentOption === 'now' ? '已支付' : '未支付'}`;
    
    let mailContent = `
      <h2>电子签证申请详情</h2>
      <p><strong>支付状态:</strong> ${paymentOption === 'now' ? '已支付' : '未支付'}</p>
      <p><strong>计划入境日期:</strong> ${startDate}</p>
      <p><strong>电子签证有效期:</strong> ${visaValidity}天</p>
      <p><strong>入境地点:</strong> ${entryPoint}</p>
      <p><strong>电子签证类型:</strong> ${visaType === 'single' ? '单次' : '多次'}</p>
      <p><strong>处理时间:</strong> ${processingTime === 'normal' ? '普通' : '加急'}</p>
      <p><strong>入境目的:</strong> ${
        entryPurpose === 'tourism' ? '旅游' : 
        entryPurpose === 'business' ? '商务' : '探亲访友'
      }</p>
      <p><strong>住宿地址:</strong> ${accommodation || '未提供'}</p>
      <p><strong>省份:</strong> ${province || '未提供'}</p>
      <p><strong>联系电话:</strong> ${phoneNumber || '未提供'}</p>
      <p><strong>申请人数量:</strong> ${applicantPhotos.length}</p>
    `;
    
    // 发送邮件
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.PROTONMAIL_ADDRESS, // 您的ProtonMail地址
      subject: mailSubject,
      html: mailContent,
      attachments: applicantPhotos.flatMap((applicant, i) => {
        const attachments = [];
        
        if (applicant.portrait) {
          attachments.push({
            filename: `applicant${i+1}_portrait.jpg`,
            content: applicant.portrait
          });
        }
        
        if (applicant.passport) {
          attachments.push({
            filename: `applicant${i+1}_passport.jpg`,
            content: applicant.passport
          });
        }
        
        return attachments;
      })
    });
    
    return NextResponse.json({ 
      success: true, 
      message: paymentOption === 'now' 
        ? '申请已成功提交，我们会通过邮件与您联系。感谢您的支付。' 
        : '申请已成功提交，我们会通过邮件与您联系。您选择了稍后支付。' 
    });
    
  } catch (error) {
    console.error('处理申请时出错:', error);
    return NextResponse.json({ 
      success: false, 
      message: '提交申请时出现错误，请稍后重试。' 
    }, { status: 500 });
  }
}
