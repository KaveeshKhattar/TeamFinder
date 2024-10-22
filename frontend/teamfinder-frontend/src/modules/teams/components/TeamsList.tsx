import { useLocation } from 'react-router-dom';
import { TeamsListProps } from '../../../types';
import TeamCard from './TeamCard'; // Adjust the import path as necessary

const TeamsList: React.FC<TeamsListProps> = ({ teams }) => {

    const location = useLocation();
    
    return (
        <div>
            {teams.map((team) => (
                <TeamCard key={team.teamId} team={team} location={`${location.pathname}`} />
            ))}
        </div>
    );
};

export default TeamsList;
