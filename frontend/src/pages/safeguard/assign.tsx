import { NextPage } from 'next'
import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { ChangeEvent, useState } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Trash2 } from 'lucide-react'
import { set } from 'cypress/types/lodash'

interface Verifier {
  name: string,
  walletAddress: string,
}

const Assign = () => {
  const [verifiersArr, setVerifiersArr] = useState<Verifier[]>([])
  const [verifierInputVal, setVerifierInputVal] = useState('')

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const handleVerifierInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifierInputVal(e.target.value)
  }

  const handleAddVerifier = () => {
    if (verifierInputVal.trim() !== '') {
      const newObj: Verifier = {
        name: 'test',
        walletAddress: verifierInputVal,
      }
      setVerifiersArr([...verifiersArr, newObj])
      
      if (verifiersArr.length == 3) {
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
  }
  
  const calculateProgress = () => {
    return Math.floor((verifiersArr.length / 3) * 100)
  }

  const handleSubmit = () => {
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
        <div className="grid gap-8">
          <div className="grid w-full items-center gap-1.5 pt-8">
            <Progress value={calculateProgress()} />
            <Label className="justify-self-end">
              {verifiersArr.length}/3 Verifiers
            </Label>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Verifier's Wallet Address</Label>
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
                    <p>{value.walletAddress}</p>
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
            <Button type="submit" disabled={submitButtonDisabled}>
              Confirm verifiers
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Assign
