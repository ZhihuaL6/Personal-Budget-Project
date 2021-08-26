
const UsageBar = ({value, max}) => {
    return (
        <div>
            <progress value={value} max={max} style={{width: '300px'}}/>
       </div>
    )
}

export default UsageBar
