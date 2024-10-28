import { useNavigate } from 'react-router-dom';
import sectionOneImg from '../assets/join-a-team.webp'
import sectionTwoImg from '../assets/team-searching-ideas-boy-search-flat-people-finding-inspiration-brain-storming-group-holding-magnifying-glass-look-around-utter-vector-concept_53562-17385.avif'
import sectionThreeImg from '../assets/img.jpg'
import sectionFourImage from '../assets/friends-meeting-cartoon-vector-22493228.jpg'

function Contents() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <>
        <div className='grid m-4 min-h-screen w-full'>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4">For people looking to <span className="font-bold">join teams,</span></p>
                <img src={sectionTwoImg} alt=""/>
            </div>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4">For teams looking to <span className="font-bold">add members,</span></p>

                <img src={sectionOneImg} alt=""/>
            </div>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4">Find events across <span className="font-bold">multiple colleges,</span></p>
                
                <img src={sectionThreeImg} alt="" className='rounded-md'/>
            </div>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4"> Meet new people, or reconnect with <span className="font-bold">old acquaintances</span></p>
                <img src={sectionFourImage} alt="" className='rounded-md'/>
            </div>

        </div>

            <div className='flex flex-col items-center justify-center w-full'>
                <p className="text-3xl"> Compete and<span className="font-bold"> win big!</span></p>
                <p className='text-md mb-4'>Don't let your friend group limit you.</p>
                <button className='text-2xl p-2 border-2 animate-flicker' onClick={handleLoginClick}>Join Now</button>
            </div>
            </>
    )
}

export default Contents;