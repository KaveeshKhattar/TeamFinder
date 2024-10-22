import { useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import collegeImg from '../assets/college.jpg'
import Loading from "../../core/components/Loading";
import { College } from "../../../types";
import SearchBar from "../../core/components/SearchBar";

function HomePage() {

    const [colleges, setColleges] = useState<College[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchColleges = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/colleges", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setColleges([...response.data])
            
        } catch (err) {
            setError("Error fetching colleges");
            console.error(err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const token = localStorage.getItem("token");
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value) {
            const responseFilteredColleges = await axios.get(
                "http://localhost:8080/api/colleges/searchColleges",
                {
                    params: {
                        name: searchTerm
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setColleges([...responseFilteredColleges.data])

        } else {
            fetchColleges();
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>; // Show an error message
    }

    return(
        <>
            <Header title="Colleges"></Header>
            <SearchBar onChange={handleSearchChange} />

            <div className="grid grid-cols-2 mt-4 gap-2">
                {colleges.map((college) => {
                    
                    const formattedName = college.name.replace(/\s+/g, '-');
                    const collegeUrl = formattedName.toLowerCase()

                    return <Link to={`/${collegeUrl}`} state={{ collegeId: college.id }} key={college.id}>
                    <div className="rounded-md">
                        <img src={collegeImg} className="rounded-md" alt="" />
                        <p className="text-black dark:text-white ">{college.name}</p>
                        <p className="text-black dark:text-white ">{college.location}</p>                        
                    </div>
                    </Link>
                })}
            </div>


        </>
    )
}

export default HomePage;