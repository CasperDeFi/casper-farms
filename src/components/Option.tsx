interface OptionData {
    key: string:
    value: string;
}

interface OptionProps {
    data: OptionData[];
}


export default function Option({data}:OptionProps) {
    return <div>
        <div>{data.map(() => <div>123</div>)}</div>
    </div>
}