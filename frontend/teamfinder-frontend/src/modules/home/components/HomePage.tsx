import { useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import collegeImg from '../assets/college.jpg'
import Loading from "../../core/components/Loading";
import { College } from "../../../types";
import SearchBar from "../../core/components/SearchBar";

function HomePage() {

    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchColleges = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token == null) {
                navigate("/login");
            }
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


        if (value) {
            try {
                const responseFilteredColleges = await axios.get(
                    "http://localhost:8080/api/colleges/searchColleges",
                    {
                        params: { name: value },
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setColleges([...responseFilteredColleges.data]);
            } catch (error) {
                console.error("Error searching colleges:", error);
            }

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

            <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-2">
                {colleges.map((college) => {
                    
                    const formattedName = college.name.replace(/\s+/g, '-');
                    const collegeUrl = formattedName.toLowerCase()

                    return <Link to={`/${collegeUrl}`} state={{ collegeId: college.id, collegeUrl: `http://localhost:5173/${location.pathname}/${collegeUrl}` }} key={college.id}>
                    <div className="dark:bg-zinc-600 bg-slate-100 rounded-md p-2">
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