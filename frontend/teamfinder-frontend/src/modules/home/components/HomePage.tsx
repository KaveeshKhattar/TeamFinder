import { useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import collegeImg from '../assets/college.jpg'

interface College {
    id: number;
    name: string;
    location: string
}

function HomePage() {

    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8080/colleges", {
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

        fetchColleges();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show an error message
    }

    return(
        <>
            <Header title="Colleges"></Header>
            <div className="flex border-2 bg-slate-100 rounded-md">
                <i className="fa-solid fa-magnifying-glass m-2 text-black "></i>
                <input type="text" placeholder="Search Colleges..." className="bg-slate-100 w-full" />
            </div>

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