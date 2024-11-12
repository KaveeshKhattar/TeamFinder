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
      const response = await axios.get(`${BASE_URL}/api/colleges`);

      if (response.status === 204) {
        // Handle no content scenario
        setColleges([]);
        setError("No colleges available");
      } else if (response.status === 200) {
        // Handle successful response with data
        console.log(response)
        setColleges(response.data);
        setError("");
      }
    } catch (err) {
      // Check if it's an AxiosError and get the response status if available
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 500) {
          // Handle 500 Internal Server Error
          setError("An error occured on the server. Please try again later.");
        } else {
          // Handle other specific errors if needed
          setError("Error fetching colleges: " + err.message);
        }
      } else {
        // Handle network errors or other unexpected errors
        setError("Unexpected error.");
      }

      // Clear the colleges list in case of an error
      fetchColleges();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);


  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      try {
        const responseFilteredColleges = await axios.get(
          `${BASE_URL}/api/colleges/search-colleges`,
          {
            params: { name: value },
          }
        );

        // Check for 204 No Content response
        if (responseFilteredColleges.status === 204) {
          setColleges([]);
          setError("No results for search query");
        } else if (responseFilteredColleges.status === 200) {
          // Check if data is available
          if (responseFilteredColleges.data.length === 0) {
            setColleges([]);
            setError("No results for search query");
          } else {
            setColleges([...responseFilteredColleges.data]);
            setError(""); // Clear any existing errors
          }
        }
      } catch (error) {
        // Handle errors from the API call
        setError("Error searching colleges: " + error);
        setColleges([]);
      }
    } else {
      // Reset to all colleges when the input is cleared
      fetchColleges();
      setError(""); // Clear any existing errors
    }
  };


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
        <div className="flex justify-center items-center min-h-screen">{error}</div>;
      </>
    )
  }

  return (
    <>
      <Header></Header>
      <SearchBar onChange={handleSearchChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-2 min-h-screen">
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
