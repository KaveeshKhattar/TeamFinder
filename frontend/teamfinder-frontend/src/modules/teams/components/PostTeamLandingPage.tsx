import { useState, useEffect } from "react"
import axios from "axios"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent } from "../../../components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "../../../components/ui/dialog"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../../components/ui/carousel"

import { Calendar, Check, ChevronsUpDown, MapPin, X } from "lucide-react"
import Header from "../../landingPage/components/Header"
import { BASE_URL } from "../../../config"
import { Event, User } from "../../../types"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"
import { useEvents } from "../../core/hooks/useEvents"

function PostTeamLandingPage() {

    const [activeEvent, setActiveEvent] = useState<Event | null>(null)
    const [comboOpen, setComboOpen] = useState(false)

    const [teamName, setTeamName] = useState("")
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [searchQuery, setSearchQuery] = useState('');

    const [users, setUsers] = useState<User[]>([])
    const { events: allEvents } = useEvents();

    const token = localStorage.getItem("token");
    const { user } = useCurrentUser();
    useEffect(() => {
        if (user?.id) {
            setCurrentUserId(user.id);
        }
    }, [user]);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })

    const handleSubmit = async () => {
        if (!activeEvent) return

        await axios.post(`${BASE_URL}/api/team`, {
            eventId: activeEvent.id,
            teamName: teamName,
            userIds: [currentUserId, ...selectedUsers.map(u => u.id)],
        })

        console.log(selectedUsers.map(u => u.id))
        // reset
        setTeamName("")
        setSelectedUsers([])
        setActiveEvent(null)
    }

    useEffect(() => {
        if (!token) return;

        const fetchUsers = async () => {
            const res = await axios.get(`${BASE_URL}/users/all-users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setUsers(Array.isArray(res.data.data) ? res.data.data : res.data.data.users)
        }

        fetchUsers()
    }, [token])

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    const toggleUser = (user: User) => {
        setSelectedUsers(prev =>
            prev.some(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold mb-2">Post your team</h1>
                <p className="text-muted-foreground mb-8">
                    Sign your team up and make yourself visible to interested individuals
                </p>

                {/* ================= EVENTS ================= */}
                <Carousel className="w-full max-w-2xl mx-auto">
                    <CarouselContent>
                        {allEvents.map(event => (
                            <CarouselItem key={event.id} className="md:basis-1/2">
                                <Card className="border border-border">
                                    <CardContent className="flex flex-col p-6">
                                        <h2 className="text-xl font-semibold mb-2">
                                            {event.name}
                                        </h2>

                                        {event.description && (
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {event.description}
                                            </p>
                                        )}

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(event.start_date)} –{" "}
                                                {formatDate(event.end_date)}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {event.venue}
                                            </div>
                                        </div>

                                        <Button
                                            className="mt-auto"
                                            onClick={() => setActiveEvent(event)}
                                        >
                                            Add your team
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </main>

            {/* ================= SINGLE DIALOG ================= */}
            <Dialog
                open={!!activeEvent}
                onOpenChange={(open) => {
                    if (!open) setActiveEvent(null)
                }}
            >
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{activeEvent?.name}</DialogTitle>
                        <DialogDescription>
                            Create a team and add members for this event.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label>Team name</Label>
                        <Input
                            placeholder="Enter team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>

                    {/* User Combobox */}
                    <div className="space-y-2">

                        <div className="relative">
                            <button
                                onClick={() => setComboOpen(!comboOpen)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-left flex items-center justify-between hover:bg-slate-50"
                            >
                                <span className="text-slate-600">Select members...</span>
                                <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                            </button>

                            {/* Dropdown */}
                            {comboOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
                                    {/* Search Input */}
                                    <div className="p-2 border-b border-slate-200">
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    {/* User List */}
                                    <div className="max-h-64 overflow-y-auto">
                                        {filteredUsers.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-slate-500">
                                                No users found
                                            </div>
                                        ) : (
                                            filteredUsers.map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => {
                                                        toggleUser(user);
                                                        setTimeout(() => setComboOpen(true), 0);
                                                    }}
                                                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                                                >
                                                    <Check
                                                        className={`w-4 h-4 ${selectedUsers.some(u => u.id === user.id)
                                                            ? 'opacity-100 text-blue-600'
                                                            : 'opacity-0'
                                                            }`}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selected Users */}
                        {selectedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                                    >
                                        <span>{user.firstName} {user.lastName}</span>
                                        <button
                                            onClick={() => toggleUser(user)}
                                            className="hover:text-red-600 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            onClick={handleSubmit}
                            disabled={!teamName.trim()}
                        >
                            Add team
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PostTeamLandingPage;
