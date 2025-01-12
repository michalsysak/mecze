import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import Matches_Table from "../components/Matches_Table.tsx";

function Matches() {
    return(
        <div className="wrapper">
                <Header></Header>
                <Matches_Table></Matches_Table>
                <Footer></Footer>
        </div>
    );
}

export default Matches;