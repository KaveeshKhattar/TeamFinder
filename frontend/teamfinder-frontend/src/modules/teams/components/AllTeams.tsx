import { useEffect, useState } from "react";
import { Team } from "../../../types";
import axios from "axios";
import Header from "../../landingPage/components/Header";
import SearchBar from "../../core/components/SearchBar";
import TeamsList from "./TeamsList";
import { useNavigate } from "react-router-dom";

function AllTeams() {

    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const navigate = useNavigate();

    const fetchAllTeams = async () => {
        const token = localStorage.getItem("token");
        if (token == null) {
            navigate("/login");
        }
        console.log("Fetching all...");
        const fetchAllTeamsResponse = await axios.get(
            "http://localhost:8080/api/teams",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (fetchAllTeamsResponse.status === 200) {
            setAllTeams(fetchAllTeamsResponse.data);
        }
        console.log("Fetched all");
    }

    useEffect(() => {
        fetchAllTeams();
    }, [])

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const token = localStorage.getItem("token");
        const value = e.target.value;
        
        if (value) {
            const responseFilteredTeams = await axios.get(
                "http://localhost:8080/api/teams/searchAllTeams",
                {
                    params: {
                        teamSearchTerm: value,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAllTeams(responseFilteredTeams.data);
        } else {
            await fetchAllTeams();
        }
    };


    return (
        <>
        <Header title="All Teams"></Header>
        <SearchBar onChange={handleSearchChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-2">
          <TeamsList
            teams={allTeams}
            location={`${location.pathname}`}
          ></TeamsList>
        </div>
        </>
    )
}

export default AllTeams;