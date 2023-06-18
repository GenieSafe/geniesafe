import { NextPage } from 'next'
import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { ChangeEvent, useState } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Trash2 } from 'lucide-react'

interface Verifier {
  verifierUserId: string
}

interface Config {
  ownerId: string
  privateKey: string
  verifiers: Verifier[]
}

const Assign = () => {
  const [verifiersArr, setVerifiersArr] = useState<Verifier[]>([])
  const [verifierInputVal, setVerifierInputVal] = useState('')
  const [pkInputVal, setPkInputVal] = useState('')

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const handleVerifierInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifierInputVal(e.target.value)
  }

  const handlePkInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPkInputVal(e.target.value)
  }

  const handleAddVerifier = () => {
    if (verifierInputVal.trim() !== '') {
      const newObj: Verifier = {
        // name: 'test',
        // walletAddress: verifierInputVal,
        verifierUserId: verifierInputVal,
      }
      setVerifiersArr([...verifiersArr, newObj])

      if (verifiersArr.length >= 2) {
        setVerifierInputVal('')
        setSubmitButtonDisabled(false)
      } else {
        setVerifierInputVal('')
      }
    }
  }

  const handleDeleteVerifier = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault()
    const newArr = [...verifiersArr]
    newArr.splice(index, 1)
    setVerifiersArr(newArr)
    if (verifiersArr.length <= 3) {
      setSubmitButtonDisabled(true)
    }
  }

  const calculateProgress = () => {
    return Math.floor((verifiersArr.length / 3) * 100)
  }

  const handleSubmit = async () => {
    const config: Config = {
      ownerId: '91944f58-def7-4ceb-bdab-7eb9e736176a',
      privateKey: pkInputVal,
      verifiers: verifiersArr,
    }

    console.log(config)
    console.log(JSON.stringify(config))

    try {
      const response = await fetch('http://localhost:3000/api/entrust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        // API call was successful
        // Do something with the response
        console.log('success')
      } else {
        // API call failed
        // Handle the error
        console.log('fail')
      }
    } catch (error) {
      // Handle any network or other errors
      console.log(error)
    }
  }

  return (
    <>
      <div className="container pb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
            Safeguard your wallet
          </h1>
          <p className="leading-7 ">
            Worry you might lose access to your wallet? Assign trusted Verifiers
            to help safeguard your private key.
          </p>
        </div>
        <div className="grid items-center w-full gap-10 pt-8">
          <div className="grid w-full  items-center gap-1.5">
            <Label >Private Key</Label>
            <Input type="password" id="privateKey" placeholder="" onChange={handlePkInputChange}/>
          </div>
          <div className="grid gap-1.5">
            <Progress value={calculateProgress()} />
            <Label className="justify-self-end">
              {verifiersArr.length}/3 Verifiers
            </Label>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label >Verifier's Wallet Address</Label>
            <div className="flex items-center w-full space-x-4">
              <Input
                type="text"
                placeholder="0x12345..."
                value={verifierInputVal}
                onChange={handleVerifierInputChange}
                disabled={verifiersArr.length === 3}
              />
              <Button
                type="submit"
                onClick={handleAddVerifier}
                disabled={verifiersArr.length === 3}
              >
                Assign
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {verifiersArr.map((value, index) => (
              <Card className="dark">
                <CardContent className="pt-6">
                  <div className="flex flex-row items-center justify-between">
                    {/* <p>{value.walletAddress}</p> */}
                    <p>{value.verifierUserId}</p>
                    <Button
                      size={'sm'}
                      variant={'destructive'}
                      onClick={(event) => handleDeleteVerifier(event, index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitButtonDisabled} onClick={handleSubmit}>
              Confirm verifiers
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Assign
