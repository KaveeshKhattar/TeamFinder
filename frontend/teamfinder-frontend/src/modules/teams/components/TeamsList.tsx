import { useLocation } from 'react-router-dom';
import { TeamsListProps } from '../../../types';
import TeamCard from './TeamCard'; // Adjust the import path as necessary

const TeamsList: React.FC<TeamsListProps> = ({ teams }) => {

    const location = useLocation();
    
    return (
        <div>
            {teams.length > 0 ? teams.map((team) => (
                <TeamCard key={team.teamId} team={team} location={`${location.pathname}`} />
            )) : (
                <p className='flex items-center justify center mt-4'>No teams yet.</p>
            )}
        </div>
    );
};

export default TeamsList;
