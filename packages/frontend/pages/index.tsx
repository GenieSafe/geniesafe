import { Box, Button, Divider, Heading, Input, Text } from '@chakra-ui/react'
import { useEthers, useSendTransaction } from '@usedapp/core'
import { ethers, providers, utils } from 'ethers'
import React, { useReducer } from 'react'
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json'
import Layout from '../components/layout/Layout'

// Update with the contract address logged out to the CLI when it was deployed
const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

type StateType = {
  greeting: string
  inputValue: string
}
type ActionType =
  | {
      type: 'SET_GREETING'
      greeting: string
    }
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: string
    }

const initialState: StateType = {
  greeting: '',
  inputValue: '',
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
    case 'SET_GREETING':
      return {
        ...state,
        greeting: action.greeting,
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    default:
      throw new Error()
  }
}

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

export const HomeIndex = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, library } = useEthers()

  // Use the localProvider as the signer to send ETH to our wallet
  const { sendTransaction } = useSendTransaction({
    signer: localProvider.getSigner(),
  })

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchContractGreeting() {
    if (library) {
      const contract = new ethers.Contract(
        GREETER_ADDRESS,
        Greeter.abi,
        library
      )
      try {
        const data = await contract.greet()
        dispatch({ type: 'SET_GREETING', greeting: data })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  // call the smart contract, send an update
  async function setContractGreeting() {
    if (!state.inputValue) return
    if (library) {
      await requestAccount()
      const signer = library.getSigner()
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
      const transaction = await contract.setGreeting(state.inputValue)
      await transaction.wait()
      fetchContractGreeting()
    }
  }

  function sendFunds() {
    sendTransaction({
      to: account,
      value: utils.parseEther('0.1'),
    })
  }

  return (
    <Layout>
      <Heading as="h1" sx={{ mb: 8 }}>
        Next.js Ethereum Starter
      </Heading>
      <Box sx={{ maxWidth: 'container.sm' }}>
        <Box>
          <Text>Greeting: {state.greeting}</Text>
          <Button
            sx={{ mt: 2 }}
            colorScheme="teal"
            onClick={fetchContractGreeting}
          >
            Fetch Greeting
          </Button>
        </Box>
        <Divider sx={{ my: 8 }} />
        <Box sx={{ mt: 8 }}>
          <Input
            type="text"
            placeholder="Enter a Greeting"
            onChange={(e) => {
              dispatch({
                type: 'SET_INPUT_VALUE',
                inputValue: e.target.value,
              })
            }}
          />
          <Button
            sx={{ mt: 2 }}
            colorScheme="teal"
            onClick={setContractGreeting}
          >
            Set Greeting
          </Button>
        </Box>
        <Divider sx={{ my: 8 }} />
        <Button colorScheme="teal" onClick={sendFunds}>
          Send Funds From Local Hardhat Chain
        </Button>
      </Box>
    </Layout>
  )
}

export default HomeIndex