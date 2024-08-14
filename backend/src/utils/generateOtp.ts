import nodemailer from 'nodemailer'


function generateOtp() {
    const numbers = '1234567890'
    let otp = ''
    for (let i = 0; i < 4; i++) {
        otp += numbers[Math.floor(Math.random() * 10)]
    }
    return otp
}
export  function SendMail(email: string) {
    const otp = generateOtp()

    const transport = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS,
        }

    })
    let info = transport.sendMail({
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Account authentication',
        text: otp
    })
    return otp
}
