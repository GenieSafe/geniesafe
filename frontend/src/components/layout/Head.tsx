import NextHead from 'next/head'
import { useRouter } from 'next/router'
import geniesafe from '../../../public/icons/geniesafe-icon.svg'

/**
 * Constants & Helpers
 */
export const WEBSITE_HOST_URL = 'https://nextjs-ethereum-starter.vercel.app/'

/**
 * Prop Types
 */
export interface MetaProps {
  description?: string
  image?: string
  title: string
  type?: string
}

/**
 * Component
 */
export const Head = ({
  customMeta,
}: {
  customMeta?: MetaProps
}): JSX.Element => {
  const router = useRouter()
  const meta: MetaProps = {
    title: 'geniesafe',
    description: 'Next.js - RainbowKit - Hardhat',
    image: '/icons/geniesafe-icon.svg',
    type: 'website',
    ...customMeta,
  }

  return (
    <NextHead>
      <title>{meta.title}</title>
      <meta content={meta.description} name="description" />
      <meta property="og:url" content={`${WEBSITE_HOST_URL}${router.asPath}`} />
      <link rel="canonical" href={`${WEBSITE_HOST_URL}${router.asPath}`} />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="geniesafe" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
    </NextHead>
  )
}
