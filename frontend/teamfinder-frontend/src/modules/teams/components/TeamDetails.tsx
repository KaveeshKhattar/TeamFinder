import { useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { Member } from "../../../types";
import teamMemberPic from '../assets/profilePic.webp'

function TeamDetails() {

  const location = useLocation();
  const { team } = location.state;

  return (
    <>
      <Header></Header>

      <div className="flex flex-col min-h-screen">
        {team.members.map((member: Member) => {
          return (
            <div className="flex rounded-md mb-2 p-2" key={member.id}>
              <div className="flex items-center">
                    <img src={member.pictureURL ? member.pictureURL : teamMemberPic} alt="" className="w-14 rounded-full mr-2 mt-2"/>
                    <div className="flex flex-col">
                      <p className="text-sm text-left font-bold">{member.firstName} {member.lastName}</p>
                      <p className="text-muted-foreground text-sm">{member.email}</p>
                    </div>                    
                  </div>
            </div>
          )
        })}
      </div>
    </>
  );
}

export default TeamDetails;
