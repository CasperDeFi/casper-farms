import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

export interface ModalProps {
    open: boolean
    onClose: (arg0: any) => void
    children?: any
    title?: string
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
    return (
        <AnimatePresence>
            <Dialog open={open} onClose={onClose}>
                <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-6">
                    <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: '-2%' }} animate={{ y: '0%' }} exit={{ y: '-2%' }} className="relative block w-full max-w-lg bg-gray-800 shadow-xl rounded-xl">
                        <div className="py-2 px-4 border-b border-gray-900 flex">
                            {title && <p className="font-medium">{title}</p>}
                            <div className="flex-1" />
                            <button type="button" onClick={onClose}>
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        {children}
                    </motion.div>
                </motion.div>
            </Dialog>
        </AnimatePresence>
    )
}
