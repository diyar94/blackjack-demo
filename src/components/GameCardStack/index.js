const GameCardStack = ({children, orientation = 'horizontal'}) => <div className={'game-card-stack'}
				style={{
					...orientation === 'horizontal' ? {flexDirection: 'row'} : {}
				}}>
		{children}
	</div>;

export default GameCardStack;
