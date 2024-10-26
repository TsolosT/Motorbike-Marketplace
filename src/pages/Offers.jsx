import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import offerIcon from '../assets/png/offer-icon.png';

function Offers() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //Get Reference
                const listingsRef = collection(db, 'listings');
                //Create query
                const q = query(
                    listingsRef, 
                    where('offer', '==', true), 
                    orderBy('timestamp', 'desc'), 
                    limit(10)
                ); 
                //Execute query
                const  querySnap = await getDocs(q);
                const listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });

                setListings(listings);
                setLoading(false);
            } catch (error) {
                toast.error('Could not fetch the offers.')
            }
        };

        fetchListings();
    }, []);

    return ( 
        <div className="category">
            <header>
                <p className="pageHeader">
                    Offers {' '} <img src={offerIcon} height={48} />
                </p>
            </header>
            {/* Todo add filter for sale or for rent only  */}
            {loading ? <Spinner/> : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <ListingItem id={listing.id} listing={listing.data} key={listing.id}/>
                            ))}
                        </ul>
                    </main>
                </>
                ) : <p>Not any offer yet.</p>}
        </div>
    );
}

export default Offers;