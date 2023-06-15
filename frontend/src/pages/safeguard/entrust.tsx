import { NextPage } from 'next'
import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { ChangeEvent, useState } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Trash2 } from 'lucide-react'

const Entrust: NextPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [cardValues, setCardValues] = useState<string[]>([])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleButtonClick = () => {
    if (inputValue.trim() !== '') {
      const newCardValues = [...cardValues, inputValue]
      setCardValues(newCardValues)

      if (newCardValues.length === 3) {
        setInputValue('')
      } else {
        setInputValue('')
      }
    }
  }

  const calculateProgress = () => {
    return Math.floor((cardValues.length / 3) * 100)
  }
  
  return (
    <>
      <div className="container pt-12 pb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
            Safeguard your wallet
          </h1>
          <p className="mb-4 leading-7">
            Worry you might lose access to your wallet? Assign trusted Verifiers
            to help safeguard your private key.
          </p>
        </div>
        <div className="grid gap-8">
          <div className="grid w-full items-center gap-1.5">
            <Progress value={calculateProgress()} />
            <Label className="justify-self-end">
              {cardValues.length}/3 Verifiers
            </Label>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Verifier's Wallet Address</Label>
            <div className="flex items-center w-full space-x-4">
              <Input
                type="text"
                placeholder="0x12345..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={cardValues.length === 3}
              />
              <Button
                onClick={handleButtonClick}
                disabled={cardValues.length === 3}
              >
                Assign
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            {cardValues.map((value) => (
              <Card className="dark">
                <CardContent className="pt-6">
                  <div className="flex flex-row gap-8">
                    <p>{value}</p>
                    {/* <Button size={'sm'} variant={'secondary'}>
                      <Trash2 className="w-4 h-4" />
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Entrust
