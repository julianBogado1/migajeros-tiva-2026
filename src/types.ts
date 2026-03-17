export interface Player {
  jugador: string;
  email: string;
  // Availability
  martes: boolean;
  jueves: boolean;
  sabado: boolean;
  // Game stats
  games_played: number;
  games_starting: number;
  played_last_game: boolean;
  // Positions
  armador: boolean;
  opuesto: boolean;
  punta: boolean;
  central: boolean;
  libero: boolean;
}
