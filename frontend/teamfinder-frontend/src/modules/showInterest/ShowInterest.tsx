import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import axios from "axios";
import { Event } from "../../types";
import { BookmarkIcon, Calendar, MapPin } from "lucide-react";

import Header from "../landingPage/components/Header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";

import { Toggle } from "../../components/ui/toggle";

function ShowInterest() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [interested, setInterested] = useState<{ [eventId: number]: boolean }>({});

  const fetchAllEvents = useCallback(async () => {
    const fetchAllEventsResponse = await axios.get(`${BASE_URL}/api/events`);
    console.log(fetchAllEventsResponse);
    if (fetchAllEventsResponse.status === 200) {
      setAllEvents(fetchAllEventsResponse.data.data);
    }
  }, []);

  const fetchAllInterestedEventsForUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${BASE_URL}/api/interested-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && Array.isArray(response.data.data)) {
        // assuming response.data is an array of event IDs
        const interestedMap: { [eventId: number]: boolean } = {};
        response.data.data.forEach((eventId: number) => {
          interestedMap[eventId] = true;
        });
        setInterested(interestedMap);
      }
    } catch (err) {
      console.error("Failed to fetch interested events:", err);
    }
  };

  useEffect(() => {
    fetchAllEvents();
    fetchAllInterestedEventsForUser();
  }, [fetchAllEvents]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handler for toggling interest
  const handleToggle = async (eventId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${BASE_URL}/api/events/${eventId}/interested-user`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Refetch the interested events to get the updated state from the backend
        await fetchAllInterestedEventsForUser();
      }
    } catch (err) {
      console.error("Failed to mark interest:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">Show Your Interest</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse events and mark your interest to let teams find you
          </p>
        </div>

        {/* Events Carousel */}
        <div className="flex items-center justify-center">
          <Carousel className="w-full max-w-2xl px-10">
            <CarouselContent>
              {allEvents.map((event) => (
                <CarouselItem key={event.id} className="">
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
                          <Toggle
                            size="sm"
                            variant="outline"
                            pressed={!!interested[event.id]}
                            onPressedChange={() => handleToggle(event.id)}
                            className="w-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          >
                            <BookmarkIcon 
                              className={`w-4 h-4 mr-2 ${
                                interested[event.id] 
                                  ? "fill-primary-foreground stroke-primary-foreground" 
                                  : ""
                              }`} 
                            />
                            {interested[event.id] ? "Interested" : "Show Interest"}
                          </Toggle>
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
export default ShowInterest;
