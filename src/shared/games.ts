export type GameId = string;

export interface Game {
  id: GameId;

  /** Game entry-point URI used as the iframe src */
  uri: string;
}
