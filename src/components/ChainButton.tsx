import classNames from 'classnames'

interface ChainButtonProps {
    onClick: (arg0: any) => void
    active: boolean
    src: string
    soon?: boolean
}

export default function ChainButton({ onClick, active, src, soon }: ChainButtonProps) {
    return (
        <button onClick={onClick} type="button" className={classNames('relative mx-auto h-24 w-24 rounded-full bg-gray-600 outline-none', active ? 'opacity-100' : 'opacity-25')}>
            {soon && <div className="absolute right-0 text-xs font-mono bg-red-500 text-white px-1 rounded">Soon</div>}
            <img className="rounded-full h-24 w-24" src={src} alt="" />
        </button>
    )
}
