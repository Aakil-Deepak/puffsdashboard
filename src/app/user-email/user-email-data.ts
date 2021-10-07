export interface UserEmailData {
    users: UserData[];
    hashcode: string;
    total: number;
}

export interface UserData {
    name: string;
    age_gate: number;
    email: string;
    access_mode: string;
    city: string;
    state: string;
    registration_time: number;    
}