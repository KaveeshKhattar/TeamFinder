export interface College {
    id: number;
    name: string;
    location: string
}

export interface Event {
    id: number;
    collegeId: number;
    date: Date;
    name: string;
    venue: string;
    teamSize: number;
    description: string;
}

export interface Team {
    name: string;
    eventId: number;
    members: Member[];
}

export interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    enabled: boolean;
}

export interface TeamUser {
    teamId: number;
    teamName: string;
    members: User[];
}

export interface HeaderProps {
    title: string;
}