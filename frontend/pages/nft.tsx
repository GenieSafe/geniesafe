import { Button, Heading, Link, Text, useToast } from '@chakra-ui/react'
import { create } from 'ipfs-http-client'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { YourNFTContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import YourNFT from '../artifacts/contracts/YourNFT.sol/YourNFT.json'
import { Layout } from '../components/layout/Layout'
import { NftList } from '../components/NftList'
import { generateTokenUri } from '../utils/generateTokenUri'

const CONTRACT_ADDRESS = LOCAL_CONTRACT_ADDRESS

const CONTRACT_CONFIG = {
  addressOrName: CONTRACT_ADDRESS,
  contractInterface: YourNFT.abi,
}

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

const IPFS_BASE_URL = 'https://ipfs.io/ipfs'

const projectId = '2DDHiA47zFkJXtnxzl2jFkyuaoq'
const projectSecret = '96a91eeafc0a390ab66e6a87f61152aa'
const projectIdAndSecret = `${projectId}:${projectSecret}`

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      'base64'
    )}`,
  },
})

const NftIndex: NextPage = () => {
  const [nftUri, setNftUri] = useState('')

  const hasNftUri = Boolean(nftUri)

  const { data: session } = useSession()
  const address = session?.user?.name

  const toast = useToast()

  // Gets the total number of NFTs owned by the connected address.
  const { data: nftBalanceData } = useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'balanceOf',
    args: address,
  })

  // Creates the contracts array for `nftTokenIds`
  const tokenOwnerContractsArray = useMemo(() => {
    let contractCalls = []

    if (nftBalanceData && nftBalanceData.toNumber) {
      const nftBalance = nftBalanceData.toNumber()

      for (let tokenIndex = 0; tokenIndex < nftBalance; tokenIndex++) {
        const contractObj = {
          ...CONTRACT_CONFIG,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, tokenIndex],
        }

        contractCalls.push(contractObj)
      }
    }

    return contractCalls
  }, [address, nftBalanceData])

  // Gets all of the NFT tokenIds owned by the connected address.
  const { data: nftTokenIds } = useContractReads({
    contracts: tokenOwnerContractsArray,
    enabled: tokenOwnerContractsArray.length > 0,
  })

  // Creates the contracts array for `nftTokenUris`
  const tokenUriContractsArray = useMemo(() => {
    if (!nftTokenIds || nftTokenIds.length === 0) {
      return []
    }

    const contractCalls = nftTokenIds?.map((tokenId) => {
      return {
        ...CONTRACT_CONFIG,
        functionName: 'tokenURI',
        args: tokenId,
      }
    })

    return contractCalls
  }, [nftTokenIds])

  // Gets all of the NFT tokenUris owned by the connected address.
  const { data: nftTokenUris } = useContractReads({
    contracts: tokenUriContractsArray,
    enabled: tokenUriContractsArray.length > 0,
  })

  const { config } = usePrepareContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'safeMint',
    args: [address, nftUri],
    enabled: hasNftUri,
  })

  const { data, write } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log('success data', data)
      setNftUri('')
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Successfully minted your NFT!</Text>
            <Text>
              <Link
                href={`https://etherscan.io/tx/${data?.blockHash}`}
                isExternal
              >
                View on Etherscan
              </Link>
            </Text>
          </>
        ),
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const mintItem = useCallback(async () => {
    const fetchImage = async () => {
      const response = await fetch(
        `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_ACCESS_KEY}`
      )

      if (!response.ok) {
        throw Error('Error with fetch')
      }

      const data = await response.json()
      return data
    }

    try {
      // Fetch a random photo from Unsplash
      const photos = await fetchImage()

      // Convert that photo into `tokenURI` metadata
      const tokenURI = generateTokenUri(photos)

      // Upload the `tokenURI` to IPFS
      const uploaded = await ipfs.add(tokenURI)

      // // This will trigger the useEffect to run the `write()` function.
      setNftUri(`${IPFS_BASE_URL}/${uploaded.path}`)
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    if (hasNftUri && write) {
      write()
    }
  }, [hasNftUri, write])

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Mint NFT
      </Heading>
      <Button colorScheme="teal" onClick={mintItem} isLoading={isLoading}>
        Mint NFT
      </Button>
      {nftTokenUris && (
        <NftList address={address} ipfs={ipfs} nftTokenUris={nftTokenUris} />
      )}
    </Layout>
  )
}

export default NftIndex
