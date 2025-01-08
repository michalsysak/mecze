import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Matches from './pages/Matches.tsx';
import Add_Matches from './pages/Add_Matches.tsx';


function App() {

    return(
        <Router>
            <Routes>
                <Route path="/" element={<Matches/>}/>
                <Route path="/add_matches" element={<Add_Matches/>}/>
            </Routes>
        </Router>
    );
}

export default App
