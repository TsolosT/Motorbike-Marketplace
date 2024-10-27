import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import offerIcon from '../assets/png/offer-icon.png';

function Offers() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);

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
                //Set for pagination
                const lastVisible = querySnap.docs[querySnap.docs.length-1];
                setLastFetchedListing(lastVisible);

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });

                setListings(listings);
                setLoading(false);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error('Could not fetch the offers.')
            }
        };

        fetchListings();
    }, []);


    // Pagination / Load More
    const onFetchMoreListings = async () => {
        try {
            //Get Reference
            const listingsRef = collection(db, 'listings');
            //Create query
            const q = query(
                listingsRef, 
                where('offer', '==', true), 
                orderBy('timestamp', 'desc'), 
                startAfter(lastFetchedListing),
                limit(10)
            ); 
            //Execute query
            const  querySnap = await getDocs(q);
            const listings = [];
            //Set for next pagination
            const lastVisible = querySnap.docs[querySnap.docs.length-1];
            setLastFetchedListing(lastVisible);
            
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            //Keep old and get the new snap
            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Could  not fetch listings')
        }
    };


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
                <br />
                <br />
                {lastFetchedListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
                )} 
                
        </div>
    );
}

export default Offers;