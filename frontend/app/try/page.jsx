import BasicNavbar from '@/components/BasicNavbar'
import React from 'react'

const page = () => {
  return (
    // Add this at the top of your existing component, right after the opening div
<div className="fixed top-0 left-0">
    <BasicNavbar/>
</div>
  )
}

export default page
