import React from 'react'
import { motion } from 'framer-motion'

export default function TextPrompt({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ x: '-50%', y: 800 }}
      animate={{ y: 0, x: '-50%' }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className='bg-white max-w-full font-mono font-semibold text-gray-700 fixed left-1/2 transform -translate-x-1/2 bottom-12 xl:bottom-18
        mx-auto border-double border-4 border-gray-800 w-max px-4 py-4 lg:px-8 lg:py-8 text-xl
      '
    >
      {children}
    </motion.div>
  )
}
