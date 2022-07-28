
const DeskStats = ({balance, sessionId}) => {

    return <div className={'desk-stats'}>
        <div>Session: {sessionId}</div>
        <div>Balance: {balance}</div>
    </div>
}

export default DeskStats;
