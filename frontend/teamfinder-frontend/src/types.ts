export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    pictureURL: string;
    bio: string;
    skills: string[];
}

export interface Event {
    id: number;
    name: string;
    description: string;
    venue: string;
    start_date: string;
    end_date: string
}

export interface Team {
    teamId: number;
    teamName: string;
    eventId: number;
    members: User[];
}
