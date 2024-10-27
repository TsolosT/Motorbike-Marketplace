import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import ReturnBack from '../components/ReturnBack';

// eslint-disable-next-line react-hooks/rules-of-hooks
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(null);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        };
        fetchListing();
    }, [navigate, params.listingId]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareLinkCopied(true);
        setTimeout(() => setShareLinkCopied(false), 2000);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <main>
            {/* Back Button */}
            <ReturnBack/>
            {/* Slider */}
            <Swiper slidesPerView={1} pagination={{ clickable: true }}>
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            style={{
                                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                backgroundSize: 'cover',
                                height: '300px', // Adjust height as needed
                            }}
                            className="swiperSlideDiv"
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="shareIconDiv" onClick={handleShare}>
                <img src={shareIcon} alt="Share It" />
            </div>
            {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

            <div className="listingDetails">
                <p className="listingName">
                    {listing.name} -{' '}
                    {listing.offer
                        ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    } €
                </p>
                <p className="listingLocation">{listing.location}</p>
                
                <div className="listingTypeBadge">
                    For {listing.type === 'rent' ? 'Rent' : 'Sale'}
                </div>
                
                {listing.offer && (
                    <p className="discountPrice">
                        {listing.regularPrice - listing.discountedPrice} € discount
                    </p>
                )}

                {/* Detail Panel */}
                <div className="detailsPanel">
                    <p className="listingLocationTitle">Motorbike Details</p>
                    <ul className="listingDetailsList">
                        <li><strong>Brand:</strong> {listing.brand}</li>
                        <li><strong>Model:</strong> {listing.model}</li>
                        <li><strong>Year:</strong> {listing.year}</li>
                        <hr className="separator" />
                        <li><strong>Engine Capacity:</strong> {listing.engineCapacity} cc</li>
                        <li><strong>Mileage:</strong> {listing.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} km</li>
                        <li><strong>Fuel Type:</strong> {listing.fuelType}</li>
                        <li><strong>Transmission:</strong> {listing.transmission}</li>
                    </ul>
                </div>

                <p className="listingLocationTitle">Location</p>
                <div className="leafletContainer">
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                            <Popup>{listing.location}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {auth.currentUser?.uid !== listing.userRef && (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">
                        Contact Owner
                    </Link>
                )}
            </div>
        </main>
    );
}

export default Listing;
