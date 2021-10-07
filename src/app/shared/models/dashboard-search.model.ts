import { GameType } from "src/app/user-email/game-type";

export interface DashboardSearchModel {
    start: number;
    end: number;
    type: GameType;
    state: string;
    city?: string;
    source: string;
}