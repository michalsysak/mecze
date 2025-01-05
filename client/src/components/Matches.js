import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [country, setCountry] = useState('');
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [newMatch, setNewMatch] = useState({
        date: '',
        homeTeam: '',
        awayTeam: '',
        homeScore: 0,
        awayScore: 0
    });

    // Pobierz wszystkie mecze
    useEffect(() => {
        axios.get('http://localhost:8080/matches')
            .then(response => setMatches(response.data))
            .catch(err => console.error(err));
    }, []);

    // Pobierz mecze danego kraju
    const fetchMatchesByCountry = () => {
        axios.get(`http://localhost:8080/matches/${country}`)
            .then(response => setFilteredMatches(response.data))
            .catch(err => console.error(err));
    };

    // Dodaj nowy mecz
    const addMatch = () => {
        axios.post('http://localhost:8080/matches', newMatch)
            .then(response => {
                alert('Mecz dodany!');
                setMatches([...matches, response.data]);
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h1>Mecze</h1>
            <h2>Dodaj mecz</h2>
            <input type="date" value={newMatch.date} onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })} />
            <input type="text" placeholder="Gospodarz" value={newMatch.homeTeam} onChange={(e) => setNewMatch({ ...newMatch, homeTeam: e.target.value })} />
            <input type="text" placeholder="Goście" value={newMatch.awayTeam} onChange={(e) => setNewMatch({ ...newMatch, awayTeam: e.target.value })} />
            <input type="number" placeholder="Wynik gospodarzy" value={newMatch.homeScore} onChange={(e) => setNewMatch({ ...newMatch, homeScore: e.target.value })} />
            <input type="number" placeholder="Wynik gości" value={newMatch.awayScore} onChange={(e) => setNewMatch({ ...newMatch, awayScore: e.target.value })} />
            <button onClick={addMatch}>Dodaj</button>

            <h2>Pobierz mecze danego kraju</h2>
            <input type="text" placeholder="Kraj" value={country} onChange={(e) => setCountry(e.target.value)} />
            <button onClick={fetchMatchesByCountry}>Szukaj</button>

            <h2>Wszystkie mecze</h2>
            <ul>
                {matches.map((match, index) => (
                    <li key={index}>{match.date} - {match.homeTeam} vs {match.awayTeam} ({match.homeScore}:{match.awayScore})</li>
                ))}
            </ul>

            <h2>Mecze danego kraju</h2>
            <ul>
                {filteredMatches.map((match, index) => (
                    <li key={index}>{match.date} - {match.homeTeam} vs {match.awayTeam} ({match.homeScore}:{match.awayScore})</li>
                ))}
            </ul>
        </div>
    );
};

export default Matches;
