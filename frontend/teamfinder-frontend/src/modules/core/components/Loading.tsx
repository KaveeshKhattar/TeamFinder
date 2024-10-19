import { BarLoader } from "react-spinners"

const Loading = () => {
    return (
        <div className="flex flex-col p-2 items-center justify-center h-screen">
            <BarLoader></BarLoader>
            <p className="p-2">Loading...</p>
        </div>
    )
}

export default Loading;