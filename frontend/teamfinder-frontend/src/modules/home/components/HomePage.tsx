import { useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
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
import { BASE_URL } from "../../../config";
import LoadingColleges from "./LoadingColleges";

function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColleges = useCallback(async () => {
    try {

      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/colleges`, {
      });
      console.log("response: ", response);
      setColleges([...response.data]);
    } catch (err) {
      setError("Error fetching colleges");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("token");
    const value = e.target.value;

    if (value) {
      console.log("Value: ", value);
      try {
        const responseFilteredColleges = await axios.get(
          `${BASE_URL}/api/colleges/searchColleges`,
          {
            params: { name: value },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if ([...responseFilteredColleges.data].length === 0) {
          setColleges([]);
          setError("No results for search query");
        } else {
          setColleges([...responseFilteredColleges.data]);
        }
      } catch (error) {
        console.error("Error searching colleges:", error);
      }
    } else {
      fetchColleges();
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        <LoadingColleges />
      </div>

    );
  }

  if (error) {
    return (
      <>
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        <div className="flex justify-center items-center min-h-screen">{error}</div>; // Show an error message
      </>
    )
  }

  return (
    <>
      <Header></Header>
      <SearchBar onChange={handleSearchChange} />

      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-2 min-h-screen">
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
