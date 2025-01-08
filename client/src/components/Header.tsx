import { NavLink } from 'react-router-dom';

function Header(){
    return(
        <header>
            <h1>Rozgrywki mistrzostw świata w piłce nożnej</h1>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Tabela meczy</NavLink>
                    </li>
                    <li>
                        <NavLink to="/add_matches" className={({ isActive }) => (isActive ? 'active' : '')}>Dodaj mecz</NavLink>
                    </li>
                </ul>
            </nav>
            <hr></hr>
        </header>
    );
}

export default Header