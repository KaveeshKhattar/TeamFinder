import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

const LoadingTeams = () => {
    const skeletons = Array(4).fill(0);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-2">
                {skeletons.map((_, index) => (
                    <Card key={index} className="w-full mb-2">
                        <CardHeader>
                            <Skeleton className="mt-8 h-6 w-[200px]" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col text-left text-lg">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col text-left text-lg">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>

                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default LoadingTeams;