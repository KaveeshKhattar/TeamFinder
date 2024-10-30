import { Link } from "react-router-dom";
import { TeamCardProps } from "../../../types";

const TeamCard: React.FC<TeamCardProps> = ({ team, location }) => {
    const teamName = team.teamName || "";
    const formattedName = teamName.replace(/\s+/g, "-");
    const teamUrl = formattedName.toLowerCase();

    return (
        <div
            key={team.teamId}
            className="flex flex-col rounded-md text-black dark:text-white dark:bg-zinc-600 bg-slate-100 mb-2"
        >
            <div className="card flex justify-between">
                <div className="card-left flex w-1/2 flex-col items-start p-2">
                    <div className="text-xl w-full text-left font-bold">
                        {team.teamName}
                    </div>
                </div>

                <div className="card-right w-1/2 flex flex-col ">
                    <ul>
                        {team.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center mb-2 p-2"
                            >
                                <p className="">
                                    
                                    {member.firstName} {member.lastName}
                                </p>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex justify-around border-t-2 border-gray-400">
                <Link
                    className="w-full p-2 m-2 text-black dark:text-white border-2 dark:border-white border-text-black rounded-md"
                    to={`${location}/${teamUrl}`}
                    state={{ team: team }}
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default TeamCard;