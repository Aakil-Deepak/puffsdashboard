import { GameType } from "src/app/user-email/game-type";

export interface LeaderBoardData {
    players: LeaderBoardPlayer[];
    hashcode: string;
    start: number;
    end: number;
    total: number;
}

export interface LeaderBoardPlayer {
    name: string;
    age_gate: number;
    email: string;
    city: string;
    state: string;
    score: number;
    position: number;
    type: GameType;
}