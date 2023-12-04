import { Loader2 } from 'lucide-react'
import Geniesafe from '../../../public/icons/geniesafe.svg'

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-center w-full h-[500px]">
        <Geniesafe className="h-36 w-36 animate-pulse"/>
        
      </div>
    </>
  )
}
