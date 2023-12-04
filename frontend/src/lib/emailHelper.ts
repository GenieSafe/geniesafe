type Payload = {
  to: string
  subject: string
  html: any
}

export const sendMail = async (data: Payload) => {
  const { to, subject, html } = data

  const payload = {
    to: to,
    subject: subject,
    html: html,
  }
  const postData = async () => {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
    return response.json()
  }
  postData()
}
