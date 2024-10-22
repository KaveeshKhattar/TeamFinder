import { IndividualListProps } from '../../../types';
import IndividualCard from './IndividualCard'; // Adjust the import path as necessary

const IndividualList: React.FC<IndividualListProps> = ({ individuals }) => {
    
    return (
        <div>
            {individuals.map((individual) => (
                <IndividualCard key={individual.id} individual={individual} />
            ))}
        </div>
    );
};

export default IndividualList;

