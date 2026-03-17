import type { Player } from './types';

const bool = (val: string | undefined) => (val ?? '').trim().toLowerCase() === 'true';

export async function loadPlayers(): Promise<Player[]> {
  const res = await fetch('/team_data_completed.csv');
  const text = await res.text();
  const lines = text.split('\n').filter((l) => l.trim());

  // Lines 0-1 are blank, line 2 is the header, lines 3+ are data
  return lines
    .slice(3)
    .filter((line) => line.replace(/;/g, '').trim().length > 0)
    .map((line) => {
      const c = line.split(';');
      // Index map (leading semicolon means col 0 is empty):
      // 1:jugador 2:email 3:prioridad
      // 4-6: lunes  7-9: martes  10-12: miercoles  13-15: jueves
      // 16-18: viernes  19-26: sabado_13-20
      // 27:armador 28:opuesto 29:punta 30:central 31:libero
      // 32:games_played 33:games_starting 34:played_last_game
      return {
        jugador: c[1]?.trim() ?? '',
        email: c[2]?.trim() ?? '',
        martes: bool(c[7]) || bool(c[8]) || bool(c[9]),
        jueves: bool(c[13]) || bool(c[14]) || bool(c[15]),
        sabado:
          bool(c[19]) || bool(c[20]) || bool(c[21]) || bool(c[22]) ||
          bool(c[23]) || bool(c[24]) || bool(c[25]) || bool(c[26]),
        armador: bool(c[27]),
        opuesto: bool(c[28]),
        punta: bool(c[29]),
        central: bool(c[30]),
        libero: bool(c[31]),
        games_played: parseInt(c[32] ?? '0', 10) || 0,
        games_starting: parseInt(c[33] ?? '0', 10) || 0,
        played_last_game: bool(c[34]),
      } satisfies Player;
    });
}
