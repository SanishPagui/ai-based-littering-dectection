import Home from '@/components/Home'
import { UserButton } from '@stackframe/stack'
import React from 'react'
import { FloatingDockDemo } from '../components/dock'


const page = () => {
  return (
    <div>
      <Home />
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-56 '>
      <FloatingDockDemo />
      </div>
    </div>
  )
}

export default page