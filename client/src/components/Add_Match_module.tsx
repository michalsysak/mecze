import { useState } from 'react';

// Interfejs dla nowego meczu
interface NewMatch {
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
}

function Add_Match_module() {
    // Stany do przechowywania danych formularza
    const [match, setMatch] = useState<NewMatch>({
        date: '',
        homeTeam: '',
        awayTeam: '',
        homeScore: 0,
        awayScore: 0,
    });

    const [message, setMessage] = useState<string>(''); // Komunikat o statusie dodania meczu

    // Obsługuje zmiany w polach formularza
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMatch(prev => ({
            ...prev,
            [name]: name.includes('Score') ? Number(value) : value // Wyniki jako liczby
        }));
    };

    // Obsługuje wysyłanie danych do backendu
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Zatrzymuje domyślne odświeżenie strony

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
                setMatch({ date: '', homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0 }); // Reset formularza
            } else {
                setMessage('Wystąpił błąd podczas dodawania meczu.');
            }
        } catch (error) {
            setMessage('Błąd połączenia z serwerem.');
            console.error('Błąd:', error);
        }
    };

    return (
        <div>
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
                    <input
                        type="text"
                        name="homeTeam"
                        value={match.homeTeam}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Goście:</label>
                    <input
                        type="text"
                        name="awayTeam"
                        value={match.awayTeam}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Wynik gospodarzy:</label>
                    <input
                        type="number"
                        name="homeScore"
                        value={match.homeScore}
                        onChange={handleChange}
                        required
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
                    />
                </div>
                <button type="submit">Dodaj mecz</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Add_Match_module;
