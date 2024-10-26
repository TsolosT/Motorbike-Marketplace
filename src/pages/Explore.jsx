import { Link } from "react-router-dom";
import Slider from '../components/Slider'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import motobikeExploreImage from '../assets/png/motorbike-explore.png'

function Explore() {
    return (
        <div className="explore">
            <header>
                <p className="pageHeader">Explore  <img src={motobikeExploreImage} height={34} /></p>
            </header>
            
            <main>
            
                <Slider />
            
                <p className="exploreCategoryHeading">
                    Categories
                </p>
                <div className="exploreCategories">
                    <Link to='/category/rent' className="categories-hover">
                        <img src={rentCategoryImage} alt="Rent" className="exploreCategoryImg" />
                        <p className="exploreCategoryName">Motobikes for rent</p>
                    </Link>
                    <Link to='/category/sale' className="categories-hover">
                        <img src={sellCategoryImage} alt="Sell" className="exploreCategoryImg" />
                        <p className="exploreCategoryName">Motobikes for sale</p>
                    </Link>
                </div>

            </main>
        </div>
    );
}

export default Explore;