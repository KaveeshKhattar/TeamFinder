import { useNavigate } from 'react-router-dom';
import sectionOneImg from '../assets/join-a-team.webp'

function Contents() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className='flex flex-col m-4 min-h-screen'>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4">For people looking to <span className="font-bold">join teams,</span></p>
                <img src={sectionOneImg} alt=""/>
            </div>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4">For teams looking to <span className="font-bold">add members,</span></p>

                <img src={sectionOneImg} alt=""/>
            </div>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4">Find events across <span className="font-bold">multiple colleges,</span></p>
                
                <img src={sectionOneImg} alt=""/>
            </div>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl mb-4"> Meet new people, or reconnect with <span className="font-bold">old acquaintances</span></p>
                <img src={sectionOneImg} alt=""/>
            </div>

            <div className='p-4 flex flex-col items-center'>
                <p className="text-3xl"> Compete and<span className="font-bold"> win big!</span></p>
                <p className='text-md mb-4'>Don't let your friend group limit you.</p>
                <button className='text-2xl border-2 animate-flicker' onClick={handleLoginClick}>Join Now</button>
            </div>

        </div>
    )
}

export default Contents;