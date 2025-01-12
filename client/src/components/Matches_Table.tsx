import { useState, useEffect } from 'react';

// Interfejs meczu
interface Match {
    id: string; // ID jako string dla React
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
}

function Matches_Table() {
    const [matches, setMatches] = useState<Match[]>([]); // Stan do przechowywania danych
    const [sortColumn, setSortColumn] = useState<string>('date'); // Kolumna sortowania
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Kolejność sortowania
    const [searchCountry, setSearchCountry] = useState('');

    // Pobieranie danych z REST API
    useEffect(() => {
        fetch('http://localhost:8080/matches')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd podczas pobierania danych');
                }
                return response.json();
            })
            .then(data => {
                // Mapowanie _id na id dla React
                const mappedData = data.map((match: any) => ({
                    id: match._id, // Mapowanie _id na id
                    date: match.date,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    homeScore: match.homeScore,
                    awayScore: match.awayScore,
                }));
                setMatches(mappedData);
            })
            .catch(error => console.error('Błąd:', error));
    }, []);

    // Funkcja do usuwania meczu
    const deleteMatch = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/matches_del/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Aktualizacja stanu po usunięciu meczu
                setMatches(matches.filter(match => match.id !== id));
            } else if (response.status === 404) {
                console.error('Mecz nie został znaleziony.');
            } else {
                console.error('Błąd podczas usuwania meczu');
            }
        } catch (error) {
            console.error('Błąd:', error);
        }
    };

    // Funkcja do sortowania
    const handleSort = (column: string) => {
        const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(order);

        const sortedMatches = [...matches].sort((a, b) => {
            if (a[column as keyof Match] < b[column as keyof Match]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[column as keyof Match] > b[column as keyof Match]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setMatches(sortedMatches);
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/matches/${searchCountry}`);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania danych');
            }
            const data = await response.json();
            setMatches(data); // Bez dodatkowego przetwarzania
        } catch (error) {
            console.error('Błąd:', error);
        }
    };

    return (
        <div className="matches_table">
            <div className="search-container">
                <input
                    type="text"
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    placeholder="Wpisz nazwę kraju"
                />
                <button onClick={handleSearch}>Szukaj</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th onClick={() => handleSort('date')}>Data</th>
                    <th onClick={() => handleSort('homeTeam')}>Gospodarze</th>
                    <th onClick={() => handleSort('awayTeam')}>Goście</th>
                    <th onClick={() => handleSort('homeScore')}>Wynik</th>
                    <th>Akcja</th>
                </tr>
                </thead>
                <tbody>
                {matches.length > 0 ? (
                    matches.map((match) => (
                        <tr key={match.id}>
                            <td>{match.date}</td>
                            <td>{match.homeTeam}</td>
                            <td>{match.awayTeam}</td>
                            <td>{match.homeScore} - {match.awayScore}</td>
                            <td>
                                <button onClick={() => deleteMatch(match.id)}>Usuń</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>Brak danych</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Matches_Table;
