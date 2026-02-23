import { Button } from "../../components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../landingPage/components/Header";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";
import { useEvents } from "../core/hooks/useEvents";
import { useState } from "react";
import AuthRequiredDialog from "../core/components/AuthRequiredDialog";
import { Skeleton } from "../../components/ui/skeleton";

function FindTeammates() {
    const { events: allEvents, loading: eventsLoading, error: eventsError } = useEvents();
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const navigate = useNavigate();

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleViewInterestedUsers = (eventId: number) => {
        if (!localStorage.getItem("token")) {
            setAuthDialogOpen(true);
            return;
        }
        navigate(`events/${eventId}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <AuthRequiredDialog
                open={authDialogOpen}
                onOpenChange={setAuthDialogOpen}
                title="Log in to view interested users"
                description="Sign up or log in to view event participants and connect with potential teammates."
            />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">Find Teammates</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse events and connect with interested individuals
          </p>
        </div>

                {/* Events Carousel */}
                <div className="flex items-center justify-center">
                    {eventsLoading ? (
                        <div className="w-full max-w-2xl px-10 space-y-3 fade-in-soft">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Card key={index} className="border border-border">
                                    <CardContent className="p-4 sm:p-6 space-y-4">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/5" />
                                        <Skeleton className="h-10 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : eventsError ? (
                        <p className="text-sm text-destructive fade-in-soft">Failed to load events. Please refresh.</p>
                    ) : (
                    <Carousel className="w-full max-w-2xl px-10">
                        <CarouselContent>
                            {allEvents.map((event) => (
                <CarouselItem key={event.id} className="md:basis-1/2">
                  <div className="p-1 sm:p-2">
                    <Card className="border border-border">
                      <CardContent className="flex flex-col p-4 sm:p-6">
                                                <div className="mb-6">
                                                    <h2 className="text-xl font-semibold mb-2">
                                                        {event.name}
                                                    </h2>
                                                    {event.description && (
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {event.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-4 mb-6">
                                                    {/* Start Date */}
                                                    <div className="flex items-start gap-3">
                                                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                        <div className="flex flex-col items-start">
                                                            <p className="text-xs text-muted-foreground mb-0.5">
                                                                Start Date
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {formatDate(event.start_date)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* End Date */}
                                                    <div className="flex items-start gap-3">
                                                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                        <div className="flex flex-col items-start">
                                                            <p className="text-xs text-muted-foreground mb-0.5">
                                                                End Date
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {formatDate(event.end_date)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Location */}
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                        <div className="flex flex-col items-start">
                                                            <p className="text-xs text-muted-foreground mb-0.5">
                                                                Location
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {event.venue}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-border">
                                                    <Button
                                                        className="w-full"
                                                        variant="default"
                                                        onClick={() => handleViewInterestedUsers(event.id)}
                                                    >
                                                        View Interested Users
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                    )}
                </div>
            </main>
        </div>
    );
}

export default FindTeammates;
