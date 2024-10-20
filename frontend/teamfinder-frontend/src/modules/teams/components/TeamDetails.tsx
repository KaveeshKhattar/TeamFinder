import { useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import profilePic from "../assets/profilePic.webp";

interface Member {
    id: number;        
    firstName: string; 
    lastName: string;  
    email: string;  
  }

function TeamDetails() {

  const location = useLocation();
  const { team } = location.state;

  return (
    <>
      <Header title={team.teamName}></Header>

      <div className="flex flex-col">
        {team.members.map((member: Member) => {
            return (
                <div className="flex dark:bg-zinc-600 bg-slate-100 rounded-md mb-2 p-2" key={member.id}>
                    <img className="w-20 mr-2 rounded-md" src={profilePic} alt="" />
                    <div className="flex flex-col">
                        <div className="flex">
                            <p className="mr-1">
                                    {member.firstName}
                            </p>
                            <p>
                                {member.lastName}
                            </p>
                        </div>                        
                        <p>
                            {member.email}
                        </p>
                    </div>
                </div>
            )
        })}
      </div>
    </>
  );
}

export default TeamDetails;
