import Image from 'next/image'

export default function Custom404() {
  return (
    <>
      <div className='flex items-center'>
        <Image src="/img/not-found.svg" width="700" height="500" alt='Not found' />
        <div className='flex flex-col gap-2'>
            
        <h1 className='text-6xl font-extrabold tracking-tight scroll-m-20 text-primary'>404</h1>
        <h1 className='text-4xl font-semibold tracking-tight scroll-m-20'>Page not found</h1>
        </div>
      </div>
    </>
  )
}
