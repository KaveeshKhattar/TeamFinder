import { useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import collegeImg from "../assets/college.jpg";
import { College } from "../../../types";
import SearchBar from "../../core/components/SearchBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { BASE_URL } from "../../../config";

function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchColleges = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token == null) {
        navigate("/login");
      }
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/colleges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setColleges([...response.data]);
    } catch (err) {
      setError("Error fetching colleges");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("token");
    const value = e.target.value;

    if (value) {
      try {
        const responseFilteredColleges = await axios.get(
          `${BASE_URL}/api/colleges/searchColleges`,
          {
            params: { name: value },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setColleges([...responseFilteredColleges.data]);
      } catch (error) {
        console.error("Error searching colleges:", error);
      }
    } else {
      fetchColleges();
    }
  };

  if (loading) {
    return (
      <>
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 gap-4 min-h-screen">
          <Card className="flex flex-col items-center justify-center">
            <Skeleton className="h-[125px] w-[80%] m-4 rounded-md" />
            <Skeleton className=" h-4 w-[80%] mt-2" />
            <Skeleton className="h-4 w-[80%] mt-2 mb-8" />
          </Card>

          <Card className="flex flex-col items-center justify-center">
            <Skeleton className="h-[125px] w-[80%] m-4 rounded-md" />
            <Skeleton className=" h-4 w-[80%] mt-2" />
            <Skeleton className="h-4 w-[80%] mt-2 mb-8" />
          </Card>
        </div>
      </>
    );
  }

  if (error) {
    return <div className="min-h-screen">Error: {error}</div>; // Show an error message
  }

  return (
    <>
      <Header></Header>
      <SearchBar onChange={handleSearchChange} />

      <div className="grid grid-cols-1 md:grid-cols-4 mt-4 gap-2 min-h-screen">
        {colleges.map((college) => {
          const formattedName = college.name.replace(/\s+/g, "-");
          const collegeUrl = formattedName.toLowerCase();

          return (
            <Link
              to={`/${collegeUrl}`}
              state={{
                collegeId: college.id,
                collegeUrl: `https://teamfinder-frontend.vercel.app/${location.pathname}/${collegeUrl}`,
              }}
              key={college.id}
            >
              <Card className="w-full">
                <CardHeader>
                  <img src={collegeImg} alt="" className="rounded-md" />
                  <CardTitle className="text-left">{college.name}</CardTitle>
                  <CardDescription className="text-left">
                    College
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <p className="text-sm mr-1">Location:</p>
                    <p className="text-sm">{college.location}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default HomePage;
