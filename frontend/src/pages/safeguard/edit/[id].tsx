import { Config, Verifier } from '../../../../types/interfaces'
import { Label } from '../../../components/ui/label'
import { Progress } from '../../../components/ui/progress'
import { Trash2 } from 'lucide-react'
import { useState, ChangeEvent, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import router from 'next/router'

// export async function getStaticPaths() {
//   return {
//     paths: [
//       // String variant:
//       '/safeguard/edit/91944f58-def7-4ceb-bdab-7eb9e736176a',
//       // Object variant:
//       { params: { id: '91944f58-def7-4ceb-bdab-7eb9e736176a' } },
//     ],
//     fallback: true,
//   }
// }

// export async function getStaticProps({params}) {
//   try {
//     // Fetch data from an API or any other data source
//     const response = await fetch(`https://api/entrust?ownerId=${params.id}`)
//     const data = await response.json()

//     return {
//       props: {
//         data,
//       },
//     }

//   } catch (error) {
//     console.error('Failed to fetch data:', error)
//     return {
//       props: {
//         data: null,
//       },
//     }
//   }
// }

export async function getServerSideProps(context) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/entrust?ownerId=${context.query.id}`
    )
    const data = await res.json()

    return { props: { data } }
  } catch (err) {
    console.error('Failed to fetch data:', err)
    return {
      props: {
        data: context.query.id,
      },
    }
  }
}

export default function EditConfig({ data }) {

  const [verifiersArr, setVerifiersArr] = useState<Verifier[]>([])
  const [verifiersNameArr, setVerifiersNameArr] = useState<string[]>([])
  const [verifierInputVal, setVerifierInputVal] = useState('')
  const [pkInputVal, setPkInputVal] = useState('')

  useEffect(() => {
    data.data[0].Verifiers.map((verifier) => {
      setVerifiersNameArr((prevVerifiersNameArr) => [
        ...prevVerifiersNameArr,
        verifier.User.firstName + ' ' + verifier.User.lastName,
      ]);
    });

    setVerifiersArr(data.data[0].Verifiers)
    setPkInputVal(data.data[0].privateKey)
  }, [])

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
  const handleVerifierInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifierInputVal(e.target.value)
  }

  const handlePkInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPkInputVal(e.target.value)
  }

  const handleAddVerifier = async () => {
    if (verifierInputVal.trim() !== '') {
      try {
        const response = await fetch(
          'http://localhost:3000/api/user?walletAddress=' + verifierInputVal,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const newObj: Verifier = {
            verifierUserId: data.data.id,
          }
          setVerifiersArr([...verifiersArr, newObj])
          setVerifiersNameArr([
            ...verifiersNameArr,
            data.data.firstName + ' ' + data.data.lastName,
          ])

          if (verifiersArr.length >= 2) {
            setVerifierInputVal('')
            setSubmitButtonDisabled(false)
          } else {
            setVerifierInputVal('')
          }
        } else {
          // API call failed
          // Handle the error
          console.log('user fetch fail')
        }
      } catch (error) {
        // Handle any network or other errors
        console.log(error)
      }
    }
  }

  const handleDeleteVerifier = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault()
    const upVerifiersArr = [...verifiersArr]
    const upVerifiersNameArr = [...verifiersNameArr]
    upVerifiersArr.splice(index, 1)
    upVerifiersNameArr.splice(index, 1)
    setVerifiersArr(upVerifiersArr)
    setVerifiersNameArr(upVerifiersNameArr)
    if (verifiersArr.length <= 3) {
      setSubmitButtonDisabled(true)
    }
  }

  const calculateProgress = () => {
    return Math.floor((verifiersArr.length / 3) * 100)
  }

  const handleSubmit = async () => {
    const verifierUserIds = verifiersArr.map(({ verifierUserId }) => ({ verifierUserId }));

    const config: Config = {
      ownerId: '91944f58-def7-4ceb-bdab-7eb9e736176a',
      privateKey: pkInputVal,
      verifiers: verifierUserIds,
    }
    
    try {
      const response = await fetch(
        `http://localhost:3000//api/entrust?walletRecoveryConfigId=${data.data[0].id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        }
      )

      if (response.ok) {
        // API call was successful
        // Do something with the response
        router.push('/safeguard')
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

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const deletedConfig = deleteConfig(data.data[0].ownerId)
  }

  const deleteConfig = async (ownerUserId: string) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/entrust?ownerUserId=' +
          ownerUserId,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        // API call was successful
        // Do something with the response
        router.push('/safeguard')
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
          <p>Editing configuration</p>
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
            <Label>Private Key</Label>
            <Input
              type="password"
              id="privateKey"
              placeholder=""
              onChange={handlePkInputChange}
              value={pkInputVal}
            />
          </div>
          <div className="grid gap-1.5">
            <Progress value={calculateProgress()} />
            <Label className="justify-self-end">
              {verifiersArr.length}/3 Verifiers
            </Label>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Verifier's Wallet Address</Label>
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
            {verifiersNameArr.map((value, index) => (
              <Card className="dark" key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-row items-center justify-between">
                    {/* <p>{value.walletAddress}</p> */}
                    <p>{value}</p>
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
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              onClick={handleDelete}
              variant={'destructive'}
            >
              Delete
            </Button>
            <Button
              type="submit"
              disabled={submitButtonDisabled}
              onClick={handleSubmit}
            >
              Confirm verifiers
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}