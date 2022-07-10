import React from 'react'
import { motion } from 'framer-motion'

export default function BouncyButton({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      animate={{ y: [1, -1, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {children}
    </motion.div>
  )
}
