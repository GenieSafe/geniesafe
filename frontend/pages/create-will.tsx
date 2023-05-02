import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { Layout } from '../components/layout/Layout'

const CreateWill: NextPage = () => {
  return (
    <Layout>
      <Heading as="h1" mb="8">
        Create Will
      </Heading>
    </Layout>
  )
}

export default CreateWill
