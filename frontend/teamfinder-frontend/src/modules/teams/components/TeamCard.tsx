import { Link } from "react-router-dom";
import { TeamCardProps } from "../../../types";
import teamMemberPic from '../assets/profilePic.webp'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const TeamCard: React.FC<TeamCardProps> = ({ team, location }) => {
  const teamName = team.teamName || "";
  const formattedName = teamName.replace(/\s+/g, "-");
  const teamUrl = formattedName.toLowerCase();

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle className="text-left text-2xl">{team.teamName}</CardTitle>
          <CardDescription className="text-left">Team</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-left text-muted-foreground mb-2">Members</p>
          <div className="flex flex-col text-left text-lg">
            <ul>
              {team.members.map((member) => (
                <div key={member.id}>
                  <div className="flex items-center">
                    <img
                      src={member.pictureURL ? member.pictureURL : teamMemberPic}
                      alt=""
                      className="w-14 rounded-full mr-2 mt-2"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-muted-foreground text-sm">{member.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <Link to={`${location}/${teamUrl}`} state={{ team: team }} className="w-full">
            <Button className="w-full" variant="secondary">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
      </>
  );
};

export default TeamCard;
