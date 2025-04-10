import Home from '@/components/Home'
import { UserButton } from '@stackframe/stack'
import React from 'react'
import { FloatingDockDemo } from '../components/dock'


const page = () => {
  return (
    <div>
      <Home />
      <FloatingDockDemo />
    </div>
  )
}

export default page