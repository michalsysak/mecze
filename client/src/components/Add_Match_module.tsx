import { useState } from 'react';

// Interfejs dla nowego meczu
interface NewMatch {
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
}

const VALID_TEAMS = [
    "katar", "ekwador", "senegal", "holandia", "anglia", "iran", "stany zjednoczone", "walia",
    "argentyna", "arabia saudyjska", "meksyk", "polska", "francja", "australia", "dania", "tunezja",
    "hiszpania", "kostaryka", "niemcy", "japonia", "belgia", "kanada", "maroko", "chorwacja", "brazylia",
    "serbia", "szwajcaria", "kamerun", "portugalia", "ghana", "urugwaj", "korea południowa"
];

function Add_Match_module() {
    const [match, setMatch] = useState<NewMatch>({
        date: '',
        homeTeam: '',
        awayTeam: '',
        homeScore: 0,
        awayScore: 0,
    });

    const [message, setMessage] = useState<string>('');

    // Obsługuje zmiany w polach formularza
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'homeTeam') {
            setMatch(prev => ({
                ...prev,
                [name]: value,
                awayTeam: prev.awayTeam === value ? '' : prev.awayTeam,
            }));
        } else {
            setMatch(prev => ({
                ...prev,
                [name]: name.includes('Score') ? Number(value) : value,
            }));
        }
    };

    // Walidacja danych wejściowych
    const validateForm = (): string | null => {
        const currentDate = new Date().toISOString().split('T')[0];

        if (new Date(match.date) > new Date(currentDate)) {
            return 'Data meczu nie może być z przyszłości.';
        }

        if (!VALID_TEAMS.includes(match.homeTeam.toLowerCase())) {
            return `Drużyna gospodarzy (${match.homeTeam}) musi być jednym z dozwolonych państw.`;
        }

        if (!VALID_TEAMS.includes(match.awayTeam.toLowerCase())) {
            return `Drużyna gości (${match.awayTeam}) musi być jednym z dozwolonych państw.`;
        }

        if (match.homeTeam.toLowerCase() === match.awayTeam.toLowerCase()) {
            return 'Drużyna gospodarzy i gości nie mogą być takie same.';
        }

        if (match.homeScore < 0 || match.awayScore < 0) {
            return 'Wynik meczu nie może być ujemny.';
        }

        return null;
    };

    // Obsługuje wysyłanie danych do backendu
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setMessage(validationError);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/matches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(match),
            });

            if (response.ok) {
                setMessage('Mecz został dodany pomyślnie!');
                setMatch({ date: '', homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0 });
            } else {
                setMessage('Wystąpił błąd podczas dodawania meczu.');
            }
        } catch (error) {
            setMessage('Błąd połączenia z serwerem.');
            console.error('Błąd:', error);
        }
    };

    return (
        <div className="add_matches">
            <h2>Dodaj nowy mecz</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Data:</label>
                    <input
                        type="date"
                        name="date"
                        value={match.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Gospodarze:</label>
                    <select
                        name="homeTeam"
                        value={match.homeTeam}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Wybierz drużynę --</option>
                        {VALID_TEAMS.map(team => (
                            <option key={team} value={team}>
                                {team.charAt(0).toUpperCase() + team.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Goście:</label>
                    <select
                        name="awayTeam"
                        value={match.awayTeam}
                        onChange={handleChange}
                        required
                        disabled={!match.homeTeam}
                    >
                        <option value="">-- Wybierz drużynę --</option>
                        {VALID_TEAMS.filter(team => team !== match.homeTeam).map(team => (
                            <option key={team} value={team}>
                                {team.charAt(0).toUpperCase() + team.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Wynik gospodarzy:</label>
                    <input
                        type="number"
                        name="homeScore"
                        value={match.homeScore}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                <div>
                    <label>Wynik gości:</label>
                    <input
                        type="number"
                        name="awayScore"
                        value={match.awayScore}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                <button type="submit">Dodaj mecz</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Add_Match_module;
