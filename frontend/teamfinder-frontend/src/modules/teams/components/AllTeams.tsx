import { useCallback, useEffect, useState } from "react";
import { Team } from "../../../types";
import axios from "axios";
import Header from "../../landingPage/components/Header";
import SearchBar from "../../core/components/SearchBar";
import TeamsList from "./TeamsList";
import { BASE_URL } from "../../../config";
import LoadingTeams from "./LoadingTeams";

function AllTeams() {

  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllTeams = useCallback(async () => {
    setLoading(true);
    console.log("Fetching all...");
    const fetchAllTeamsResponse = await axios.get(
      `${BASE_URL}/api/teams`,
    );
    if (fetchAllTeamsResponse.status === 200) {
      setAllTeams(fetchAllTeamsResponse.data);      
    }
    console.log("Fetched all");
    setLoading(false);
  }, [])

  useEffect(() => {
    fetchAllTeams();
  }, [fetchAllTeams])

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const filteredTeams = allTeams.filter((team) =>
        team.members.some((member) =>
          member.fullName.toLowerCase().includes(value.toLowerCase()) // Use value instead of searchTerm
        )
      );
      setAllTeams(filteredTeams);
    } else {
      await fetchAllTeams();
    }

  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        <LoadingTeams />
      </div>
    );
  }


  return (
    <>
      <Header></Header>
      <SearchBar placeholder="Find teams by your friends' name" onChange={handleSearchChange} />

      <div className="">
        <TeamsList
          teams={allTeams}
          location={`${location.pathname}`}
        ></TeamsList>
      </div>
    </>
  )
}

export default AllTeams;