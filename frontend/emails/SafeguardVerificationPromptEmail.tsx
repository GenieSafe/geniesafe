import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import { ShieldAlert } from 'lucide-react'
import * as React from 'react'

interface EmailProps {
  redirectUrl?: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ''

export const SafeguardVerificationPromptEmail = ({
  redirectUrl,
}: EmailProps) => (
  <Tailwind
    config={{
      theme: {
        extend: {
          colors: {
            brand: '#8B5CF6',
          },
        },
      },
    }}
  >
    <Html>
      <Head />
      <Preview>Request for verification</Preview>
      <Body style={main} className="bg-black">
        <Container style={container}>
          <Img
            src={`https://xppazbevnejnfkzhjdab.supabase.co/storage/v1/object/public/images/logos/geniesafe-logo-text-hor.png?t=2023-11-07T19%3A10%3A42.995Z`}
            className="mx-auto my-0"
            width="150"
            height="50"
            alt="geniesafe"
          />

          <Section className="w-full my-6">
            <Row>
              <Column className="border border-gray-400/30 border-solid w-[140px]" />
              <Column className="border border-solid border-brand w-[200px]" />
              <Column className="border border-gray-400/30 border-solid w-[140px]" />
            </Row>
          </Section>

          <Section className="text-center">
            <ShieldAlert className="text-yellow-500" size={100} />
          </Section>

          <Text className="text-2xl text-center text-white">
            Someone's private key is{' '}
            <strong className="text-brand">missing</strong>!
          </Text>

          <Section className="px-8 py-10 text-center border border-white border-solid rounded-md">
            <Text className="mt-0 text-white">
              As one of the assigned verifiers, please confirm that the owner
              has lost his private key and verify the safeguard request by
              clicking the button below.
            </Text>

            <Button
              href={redirectUrl}
              className="px-5 py-3 text-sm text-white rounded-md bg-brand"
            >
              Verify
            </Button>
          </Section>

          <Text className="text-xs text-center text-white">
            If you think this is a mistake, please contact{' '}
            <span>
              <Link>support</Link>
            </span>
            .
          </Text>

          <Text className="text-xs text-center text-brand/80">
            geniesafe&nbsp;・&nbsp;Universiti Malaya, Kuala Lumpur
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

export default SafeguardVerificationPromptEmail

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
}

const container = {
  width: '480px',
  margin: '0 auto',
  padding: '20px 0 20px',
}
