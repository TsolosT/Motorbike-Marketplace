import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Category() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);

    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //Get Reference
                const listingsRef = collection(db, 'listings');
                //Create query
                const q = query(
                    listingsRef, 
                    where('type', '==', params.categoryName), 
                    orderBy('timestamp', 'desc'), 
                    limit(10)
                ); 
                //Execute query
                const  querySnap = await getDocs(q);
                const listings = [];
                //Set for pagination
                const lastVisible = querySnap.docs[querySnap.docs.length-1];
                setLastFetchedListing(lastVisible || null);
                
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
                toast.error('Could  not fetch listings')
            }
        };

        fetchListings();
    }, [params.categoryName]);

    // Pagination / Load More
    const onFetchMoreListings = async () => {
        try {
            //Get Reference
            const listingsRef = collection(db, 'listings');
            //Create query
            const q = query(
                listingsRef, 
                where('type', '==', params.categoryName), 
                orderBy('timestamp', 'desc'), 
                startAfter(lastFetchedListing),
                limit(10)
            ); 
            //Execute query
            const  querySnap = await getDocs(q);
            const listings = [];
            //Set for next pagination
            const lastVisible = querySnap.docs[querySnap.docs.length-1];
            setLastFetchedListing(lastVisible || null);
            
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
                    {params.categoryName === 'rent' ? 'Motobikes for rent' : 'Motobikes for sale'}
                </p>
            </header>
            {loading ? <Spinner/> : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <ListingItem id={listing.id} listing={listing.data} key={listing.id}/>
                            ))}
                        </ul>
                    </main>
                    <br />
                    <br />
                    {lastFetchedListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
                    )} 
                </>
                ) : <p>No listings for {params.categoryName} </p>}
        </div>
    );
}

export default Category;