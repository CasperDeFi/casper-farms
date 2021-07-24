import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

export default function ListBox({ label, data, value, onChange }) {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className="">
                {label && <p className="text-xs font-mono opacity-50 mb-1">{label}</p>}

                <Listbox.Button>
                    <div className="border rounded border-purple-700 py-2 px-4">{value.key}</div>
                </Listbox.Button>
                <AnimatePresence>
                    <Listbox.Options>
                        <motion.div
                            className="mt-2 z-20 bg-black bg-opacity-90 absolute border rounded border-purple-700 p-6 space-y-2 max-h-96 overflow-auto hide-scroll-bars shadow-2xl"
                            initial={{ height: '0' }}
                            animate={{ height: 'auto' }}
                            exit={{ height: '0' }}
                        >
                            {data.map((data) => (
                                <Listbox.Option key={data.key} value={data} disabled={data.disabled}>
                                    {data.key}
                                </Listbox.Option>
                            ))}
                        </motion.div>
                    </Listbox.Options>
                </AnimatePresence>
            </div>
        </Listbox>
    )
}
