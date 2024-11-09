import {
    Card,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

const LoadingColleges = () => {
    const skeletons = Array(6).fill(0);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-2 min-h-screen">
                {skeletons.map((_, index) => (
                    <Card key={index} className="flex flex-col items-center justify-center">
                        <Skeleton className="h-[125px] w-[80%] m-4 rounded-md" />
                        <Skeleton className="h-4 w-[80%] mt-2" />
                        <Skeleton className="h-4 w-[80%] mt-2 mb-8" />
                    </Card>
                ))}
            </div>
        </>
    );
}

export default LoadingColleges;