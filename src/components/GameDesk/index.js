import GameCardStack from "../GameCardStack";
import GameCard from "../GameCard";

const GameDesk = ({cards, open = false}) => <GameCardStack>
	{cards && cards.map(({rank = 'N/A', suite = 'Diamonds'}, key) => <GameCard key={key} open={open} suite={suite}
																			   value={rank}/>)}
</GameCardStack>

export default GameDesk;
