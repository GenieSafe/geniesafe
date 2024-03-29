import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || '587'),
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER,
    pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD,
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Ensure that the request body is parsed as JSON
    const { to, subject, html } = req.body

    const info = await transporter.sendMail({
      from: {
        name: 'geniesafe',
        address: process.env.NEXT_PUBLIC_SMTP_FROM || 'geniesafedev@gmail.com',
      },
      to: to,
      subject: subject,
      html: html,
    })

    return res.status(200).json({ message: `${info.messageId}` })
  } else {
    // return 405
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
