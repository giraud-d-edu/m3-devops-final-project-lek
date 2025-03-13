export interface PlayerLeaderboardProps {
  isSelectedPlayer: boolean;
  uuid: string;
  pseudo: string;
  ranking: number;
  avatar: string;
  totalScore: number;
  numberGameWin: number;
  numberGameLoose: number;
  avgAccuracy: number;
  numberOfSoloGamePlay: number;
  kps: number;
}

export interface LeaderboardProps {
  data: Array<PlayerLeaderboardProps>;
  limitMin: number;
  limitMax: number;
  top5: Array<PlayerLeaderboardProps>;
}

export interface LeaderboardLimits {
  limitMin: number;
  limitMax: number;
}

