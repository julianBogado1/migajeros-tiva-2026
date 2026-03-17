import { useEffect, useState } from 'react';
import { loadPlayers } from './parseCSV';
import PlayerTable from './PlayerTable';
import type { Player } from './types';
import './App.css';

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers()
      .then(setPlayers)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Migajeros</h1>
        <p className="subtitle">Equipo TIVA 2026</p>
      </header>
      <main className="app-main">
        {error && <p className="error">Error cargando datos: {error}</p>}
        {players.length > 0 ? (
          <PlayerTable players={players} />
        ) : (
          !error && <p className="loading">Cargando...</p>
        )}
      </main>
    </div>
  );
}
