import { useCallback, useEffect, useState } from "react";
import { Team } from "../../../types";
import axios from "axios";
import Header from "../../landingPage/components/Header";
import SearchBar from "../../core/components/SearchBar";
import TeamsList from "./TeamsList";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";

function AllTeams() {

  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAllTeams = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/login");
    }
    setLoading(true);
    console.log("Fetching all...");
    const fetchAllTeamsResponse = await axios.get(
      `${BASE_URL}/api/teams`,
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
    setLoading(false);
  }, [navigate])

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
        { }

        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
          <Card className="w-[650px] mt-16">
            <CardHeader>
              <Skeleton className="mt-8 h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-left text-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-left text-lg mt-2">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
          </Card>

          <Card className="w-[650px] mt-16">
            <CardHeader>
              <Skeleton className="mt-8 h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-left text-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-left text-lg mt-2">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
          </Card>

          <Card className="w-[650px] mt-16">
            <CardHeader>
              <Skeleton className="mt-8 h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-left text-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-left text-lg mt-2">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
          </Card>

          <Card className="w-[650px] mt-16">
            <CardHeader>
              <Skeleton className="mt-8 h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-left text-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-left text-lg mt-2">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
          </Card>
        </div>
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