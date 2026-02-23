export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    pictureURL: string;
    bio: string;
    skills: string[];
    preferredRole?: string;
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
    openSlots?: number;
    rolesLookingFor?: string[];
    members: User[];
}

export interface ChatRoom {
    id: string;
    otherUserId: string;
    otherUserName: string;
    otherUserPictureUrl: string;
}
  
export interface ChatMessage {
    id: number;
    chatRoomId: string;
    senderId: number;
    senderName: string;
    content: string;
    timestamp: string;
}
  
