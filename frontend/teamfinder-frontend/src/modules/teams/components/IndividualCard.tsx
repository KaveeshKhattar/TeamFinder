import { IndividualCardProps } from "../../../types";
import teamMemberPic from '../assets/profilePic.webp'

const IndividualCard: React.FC<IndividualCardProps> = ({ individual }) => {
    return (

        <div className="flex flex-col h-full w-full mt-2 mr-2">
            <div className="flex flex-col border border-gray-500 rounded-md">
                <div className="flex-grow p-2">
                    <div className="flex flex-col text-left text-lg">
                        <ul>
                            <div key={individual.id}>
                                <div className="flex items-center">
                                    <img
                                        src={individual.pictureURL ? individual.pictureURL : teamMemberPic}
                                        alt=""
                                        className="w-14 rounded-full mr-2 mt-1"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold">
                                            {individual.firstName} {individual.lastName}
                                        </p>
                                        <p className="text-muted-foreground text-sm">{individual.email}</p>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndividualCard;