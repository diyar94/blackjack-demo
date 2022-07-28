const getIcon = (suite) => {
	switch (suite.toLowerCase()) {
		case 'hearts':
			return <div className={`card-suite-icon card-suite-${suite.toLowerCase()}`}>&#9829;</div>;

		case 'diamonds':
			return <div className={`card-suite-icon card-suite-${suite.toLowerCase()}`}>&#9830;</div>;

		case 'spades':
			return <div className={'card-suite-icon'}>&#9824;</div>;

		case 'clubs':
			return <div className={'card-suite-icon'}>&#9827;</div>;

		default:
			return null;
	}
};
const GameCard = ({suite, value, open = false,}) => <div className={'game-card'}>
	<div className={open ? 'game-card-open' : 'game-card-closed'}>
		{open && <>
			<div className={'game-card-suite'}>{getIcon(suite)}</div>
			<div className={'game-card-value'}>{value}</div>
		</>}

	</div>
</div>;


export default GameCard;
