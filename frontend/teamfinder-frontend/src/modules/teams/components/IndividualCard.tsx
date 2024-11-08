import { IndividualCardProps } from "../../../types";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import teamMemberPic from '../assets/profilePic.webp'

const IndividualCard: React.FC<IndividualCardProps> = ({ individual }) => {
    return (

        <div className="flex flex-col mb-2 h-full mt-4">
            <Card className="flex flex-col h-full">
                <CardContent className="flex-grow">
                    <div className="flex flex-col text-left text-lg">
                        <ul>
                            
                                <div key={individual.id}>
                                    <div className="flex items-center">
                                        <img
                                            src={individual.pictureURL ? individual.pictureURL : teamMemberPic}
                                            alt=""
                                            className="w-14 rounded-full mr-2 mt-2"
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
                </CardContent>
                
            </Card>
        </div>
    )
}

export default IndividualCard;