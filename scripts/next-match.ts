import { readFileSync } from 'fs';
import { resolve } from 'path';

const POSITIONS = ['armador', 'opuesto', 'punta', 'central', 'libero'] as const;
type Position = (typeof POSITIONS)[number];

const TIME_SLOTS = [
  'lunes_22', 'lunes_23',
  'martes_21', 'martes_22', 'martes_23',
  'miercoles_21', 'miercoles_22', 'miercoles_23',
  'jueves_21', 'jueves_22', 'jueves_23',
  'viernes_21', 'viernes_22', 'viernes_23',
  'sabado_13', 'sabado_14', 'sabado_15', 'sabado_16',
  'sabado_17', 'sabado_18', 'sabado_19', 'sabado_20',
] as const;
type TimeSlot = (typeof TIME_SLOTS)[number];

interface Player {
  jugador: string;
  gamesPlayed: number;
  gamesStarting: number;
  playedLastGame: boolean;
  availability: Record<TimeSlot, boolean>;
  positions: Position[];
}

function bool(val: string | undefined): boolean {
  return (val ?? '').trim().toLowerCase() === 'true';
}

function loadPlayers(csvPath: string): Player[] {
  const text = readFileSync(csvPath, 'utf-8');
  const lines = text.split('\n').filter((l) => l.trim());
  // lines[0..1] are blank, lines[2] is the header, lines[3+] are data
  return lines
    .slice(3)
    .filter((line) => line.replace(/;/g, '').trim().length > 0)
    .map((line) => {
      const c = line.split(';');
      // col 1:jugador 2:games_played 3:games_starting 4:played_last_game
      // 5:lunes_22 6:lunes_23
      // 7:martes_21 8:martes_22 9:martes_23
      // 10:miercoles_21 11:miercoles_22 12:miercoles_23
      // 13:jueves_21 14:jueves_22 15:jueves_23
      // 16:viernes_21 17:viernes_22 18:viernes_23
      // 19-26: sabado_13..sabado_20
      // 27:armador 28:opuesto 29:punta 30:central 31:libero
      const slotCols: [TimeSlot, number][] = [
        ['lunes_22', 5], ['lunes_23', 6],
        ['martes_21', 7], ['martes_22', 8], ['martes_23', 9],
        ['miercoles_21', 10], ['miercoles_22', 11], ['miercoles_23', 12],
        ['jueves_21', 13], ['jueves_22', 14], ['jueves_23', 15],
        ['viernes_21', 16], ['viernes_22', 17], ['viernes_23', 18],
        ['sabado_13', 19], ['sabado_14', 20], ['sabado_15', 21], ['sabado_16', 22],
        ['sabado_17', 23], ['sabado_18', 24], ['sabado_19', 25], ['sabado_20', 26],
      ];
      const availability = Object.fromEntries(
        slotCols.map(([slot, col]) => [slot, bool(c[col])])
      ) as Record<TimeSlot, boolean>;

      const positions = POSITIONS.filter((_, i) => bool(c[27 + i]));

      return {
        jugador: c[1]?.trim() ?? '',
        gamesPlayed: parseInt(c[2] ?? '0', 10) || 0,
        gamesStarting: parseInt(c[3] ?? '0', 10) || 0,
        playedLastGame: bool(c[4]),
        availability,
        positions,
      };
    })
    .filter((p) => p.jugador.length > 0);
}

function availableForSlot(slot: TimeSlot, players: Player[]): Player[] {
  return players
    .filter((p) => p.availability[slot])
    .sort((a, b) => {
      // Priority: didn't play last game first (rotation fairness)
      if (a.playedLastGame !== b.playedLastGame) return a.playedLastGame ? 1 : -1;
      // Then fewer total games (less game time = higher priority)
      if (a.gamesPlayed !== b.gamesPlayed) return a.gamesPlayed - b.gamesPlayed;
      return a.jugador.localeCompare(b.jugador);
    });
}

function groupByPosition(players: Player[]): [Position, Player[]][] {
  return POSITIONS
    .map((pos) => [pos, players.filter((p) => p.positions.includes(pos))] as [Position, Player[]])
    .filter(([, ps]) => ps.length > 0);
}

function printSlot(slot: TimeSlot, players: Player[]): void {
  const available = availableForSlot(slot, players);
  console.log(`\n=== ${slot} — ${available.length} jugadora(s) disponible(s) ===`);

  if (available.length === 0) {
    console.log('  (sin jugadoras disponibles)');
    return;
  }

  console.log('\n  Por posición:');
  for (const [pos, ps] of groupByPosition(available)) {
    const names = ps
      .map((p) => (p.playedLastGame ? p.jugador : `${p.jugador}*`))
      .join(', ');
    console.log(`    ${pos.padEnd(10)}: ${names}`);
  }

  console.log('\n  Orden de prioridad (* = no jugó el último partido):');
  for (const p of available) {
    const priority = p.playedLastGame ? '  ' : '* ';
    const positions = p.positions.join(', ') || '—';
    console.log(`    ${priority}${p.jugador.padEnd(14)} jugados: ${p.gamesPlayed}  posiciones: ${positions}`);
  }
}

// --- main ---

const csvPath = resolve(process.cwd(), 'public/team_data_completed.csv');
const players = loadPlayers(csvPath);

const arg = process.argv[2];

if (!arg) {
  console.log('Uso: npm run next-match -- <slot>');
  console.log(`Slots disponibles: ${TIME_SLOTS.join(', ')}`);
  console.log('\nTambién podés pasar solo el día (ej: "martes", "sabado") para ver todos sus slots.\n');
  console.log('Slots de partido (martes, jueves, sábado):');
  const matchSlots = TIME_SLOTS.filter(
    (s) => s.startsWith('martes') || s.startsWith('jueves') || s.startsWith('sabado')
  );
  for (const slot of matchSlots) {
    printSlot(slot, players);
  }
} else if (TIME_SLOTS.includes(arg as TimeSlot)) {
  printSlot(arg as TimeSlot, players);
} else {
  const matching = TIME_SLOTS.filter((s) => s.startsWith(arg));
  if (matching.length > 0) {
    for (const slot of matching) {
      printSlot(slot, players);
    }
  } else {
    console.error(`Slot desconocido: "${arg}"`);
    console.error(`Slots disponibles: ${TIME_SLOTS.join(', ')}`);
    process.exit(1);
  }
}
