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
    fullName: string;
    role: string;
    enabled: boolean;
    pictureURL: string;
}

export interface Team {
    teamId: number;
    teamName: string;
    members: User[];
    eventId: number;
}

export interface HeaderProps {
    title: string;
}

export interface TeamsListProps {
    teams: Team[];        // Array of Team objects
    location: string;
}

export interface TeamCardProps {
    team: Team;        // Array of Team objects
    location: string;
}

export interface IndividualListProps {
    individuals: Member[];        // Array of Team objects
}

export interface IndividualCardProps {
    individual: Member
}

export interface SearchBarProps {
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}