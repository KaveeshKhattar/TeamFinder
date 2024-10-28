import { IndividualListProps } from '../../../types';
import IndividualCard from './IndividualCard'; // Adjust the import path as necessary

const IndividualList: React.FC<IndividualListProps> = ({ individuals }) => {
    
    return (
        <div>
            {individuals.length > 0 ? individuals.map((individual) => (
                <IndividualCard key={individual.id} individual={individual} />
            )) : (
                <p className='mt-4'>No interested people yet.</p>
            )}
        </div>
    );
};

export default IndividualList;

