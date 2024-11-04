import Header from "../../landingPage/components/Header";

interface ErrorProps {
    message: string
}

const Error: React.FC<ErrorProps> = ({ message }) => {

    return (
        <>
        <Header />
        <div className="text-bg-500">
            {message}
        </div>
    </>
    )    
}

export default Error;