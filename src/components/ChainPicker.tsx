import Modal from '../components/Modal'
import ChainButton from '../components/ChainButton'

export default function ChainPicker({ open, onClose, chain, setChain }) {
    return (
        <Modal open={open} onClose={onClose} title="Choose Chain">
            <div className="p-12 grid grid-cols-3 gap-12">
                <ChainButton onClick={() => setChain('ETH')} src="/img/eth.png" active={chain === 'ETH'} />
                <ChainButton onClick={() => setChain('BSC')} src="/img/bsc.png" active={chain === 'BSC'} />
                <ChainButton onClick={() => setChain('FTM')} src="/img/ftm.png" active={chain === 'FTM'} />
                <ChainButton soon onClick={() => setChain('KCC')} src="/img/kcc.png" active={chain === 'KCC'} />
                <ChainButton soon onClick={() => setChain('MATIC')} src="/img/matic.png" active={chain === 'MATIC'} />
            </div>
        </Modal>
    )
}
