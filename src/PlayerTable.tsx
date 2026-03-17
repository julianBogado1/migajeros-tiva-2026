import type { Player } from './types';
import styles from './PlayerTable.module.css';

interface Props {
  players: Player[];
}

const Check = ({ value }: { value: boolean }) =>
  value ? <span className={styles.yes}>✓</span> : <span className={styles.no}>–</span>;

const DayBadge = ({ label, active }: { label: string; active: boolean }) => (
  <span className={`${styles.badge} ${active ? styles.badgeActive : styles.badgeInactive}`}>
    {label}
  </span>
);

const PositionBadge = ({ label, active }: { label: string; active: boolean }) =>
  active ? <span className={styles.posBadge}>{label}</span> : null;

export default function PlayerTable({ players }: Props) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Partidos</th>
            <th>Titular</th>
            <th>Jugó último</th>
            <th>Disponibilidad</th>
            <th>Posiciones</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.jugador}>
              <td className={styles.name}>{p.jugador}</td>
              <td className={styles.center}>{p.games_played}</td>
              <td className={styles.center}>{p.games_starting}</td>
              <td className={styles.center}>
                <Check value={p.played_last_game} />
              </td>
              <td>
                <div className={styles.days}>
                  <DayBadge label="Mar" active={p.martes} />
                  <DayBadge label="Jue" active={p.jueves} />
                  <DayBadge label="Sáb" active={p.sabado} />
                </div>
              </td>
              <td>
                <div className={styles.positions}>
                  <PositionBadge label="Arm" active={p.armador} />
                  <PositionBadge label="Opu" active={p.opuesto} />
                  <PositionBadge label="Pun" active={p.punta} />
                  <PositionBadge label="Cen" active={p.central} />
                  <PositionBadge label="Lib" active={p.libero} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
