export interface HistoricProps {
  data: Array<HistoricGridshotProps | HistoricTrackingProps>;
}

export interface HistoricGridshotProps {
  score: number;
  accuracy: number;
  gameDate: Date;
  kps: number;
  bestStrike: number;
}

export interface HistoricTrackingProps {
  score: number;
  accuracy: number;
  gameDate: Date;
}

export interface HistoricCompProps {
  score: number;
  accuracy: number;
  gameDate: Date;
  kps?: number;
  bestStrike?: number;
}
