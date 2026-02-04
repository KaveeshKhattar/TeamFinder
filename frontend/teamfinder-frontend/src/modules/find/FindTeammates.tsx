import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Event } from "../../types";
import { BASE_URL } from "../../config";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../landingPage/components/Header";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";

function FindTeammates() {
    const [allEvents, setAllEvents] = useState<Event[]>([]);

    const fetchAllEvents = useCallback(async () => {
        const fetchAllEventsResponse = await axios.get(`${BASE_URL}/api/events`);
        if (fetchAllEventsResponse.status === 200) {
            setAllEvents(fetchAllEventsResponse.data.data);
        }
    }, []);

    useEffect(() => {
        fetchAllEvents();
    }, [fetchAllEvents]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">Find Teammates</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse events and connect with interested individuals
          </p>
        </div>

                {/* Events Carousel */}
                <div className="flex items-center justify-center">
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
                                                    <Link to={`events/${event.id}`} className="block">
                                                        <Button className="w-full" variant="default">
                                                            View Interested Users
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                    </Link>
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
                </div>
            </main>
        </div>
    );
}

export default FindTeammates;
