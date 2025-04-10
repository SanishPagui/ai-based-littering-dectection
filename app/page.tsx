import { UserButton } from '@stackframe/stack'
import React from 'react'
import { FloatingDockDemo } from '../components/dock'

const page = () => {
  return (
    <div>
      <UserButton/>
      <FloatingDockDemo />
    </div>
  )
}

export default page