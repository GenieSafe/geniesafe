import HelloEmail from '../../../emails/HelloEmail'
import type { NextApiRequest, NextApiResponse } from 'next'
import { render } from '@react-email/render'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.NODEMAILER_PW,
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
      from: process.env.SMTP_FROM || 'alifmazli01@gmail.com', // sender address
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
