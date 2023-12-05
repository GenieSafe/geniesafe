import Geniesafe from '../../../public/icons/geniesafe.svg'
export default function Logo() {
  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        <Geniesafe className="h-14 w-14 text-primary" />
        <h1 className="text-4xl font-semibold tracking-tight scroll-m-20">
          geniesafe
        </h1>
      </div>
    </>
  )
}
