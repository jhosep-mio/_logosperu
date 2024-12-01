'use client'
import React, { useState } from 'react'
import { CgMenuGridR } from 'react-icons/cg'

export const ButtonMenu = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShowMenu(!showMenu)
        }}
      >
        <CgMenuGridR className="text-5xl text-main" />
      </button>

    </>
  )
}
