import Contents from "./Contents";
import Footer from "./Footer";
import Header from "./Header";

function LandingPage() {

    return (
        <div className='flex flex-col justify-between items-center max-w-3xl m-auto'>
            <Header title="TeamFinder"></Header>
            <Contents></Contents>
            <Footer></Footer>
        </div>
    )
}

export default LandingPage;