import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import Add_Match_module from "../components/Add_Match_module.tsx";

function Add_Matches() {
    return(
        <div className="wrapper">
            <Header></Header>
            <Add_Match_module></Add_Match_module>
            <Footer></Footer>
        </div>
    );
}

export default Add_Matches;