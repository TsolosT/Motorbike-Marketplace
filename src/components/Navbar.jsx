import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'; // that
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'; //fix that
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'; //that
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";


function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);

    const pathMatchRoute = (route) => {
        if (route == location.pathname) {
            return true;
        }
    };
    //Check if logged in
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true); // User is logged in
            } else {
                setLoggedIn(false); // User is not logged in
            }
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);

    return (  
        <footer className="navbar">   
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={() => navigate('/')}>
                    <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                    <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/offers')}>
                    <OfferIcon  fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                    <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offers</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/profile')}>
                    <PersonOutlineIcon  fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                    <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>{loggedIn ? 'Profile' : 'Sign In/Up'}</p>
                </li>
            </ul>
        </nav>
    </footer>
    
    );
}

export default Navbar;