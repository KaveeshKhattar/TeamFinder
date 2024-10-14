import sectionOneImg from '../assets/join-a-team.webp'

function Contents() {
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
                <p className="text-3xl mb-4"> Don't let your friend group <span className="font-bold">limit you!</span></p>
                <button className='text-3xl border-2 border-blue-500 animate-flicker'>Sign Up</button>
            </div>

        </div>
    )
}

export default Contents;