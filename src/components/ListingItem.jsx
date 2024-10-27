import { Link } from "react-router-dom";
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg';
import {ReactComponent as MileageIcon} from '../assets/svg/mileageIcon.svg';
import {ReactComponent as FuelIcon} from '../assets/svg/fuelIcon.svg';
import {ReactComponent as TransmissionIcon} from '../assets/svg/transmissionIcon.svg';
import {ReactComponent as PriceIcon} from '../assets/svg/priceIcon.svg';
import {ReactComponent as LocationIcon} from '../assets/svg/locationIcon.svg';
import {ReactComponent as DiscountOfferIcon} from '../assets/svg/discountOfferIcon.svg';
import {ReactComponent as MotobikeIcon} from '../assets/svg/motobikeIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'

function ListingItem({ listing, id, onDelete, onEdit }) {
    return ( 
        <li className="categoryListing">
            <Link to={`/category/${listing.type}/${id}`} className='categoryListingLink' >
                <img src={[listing.imgUrls[0]]} alt={listing.name} className='categoryListingImg' />
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">
                        <LocationIcon fill="#2c2c2c"  width="26px" height="26px"  style={{ verticalAlign: 'middle' }} /> {listing.location}
                    </p>
                    <p className="categoryListingName">
                        <MotobikeIcon fill="#2c2c2c"  width="26px" height="26px"  style={{ verticalAlign: 'middle' }} />  {listing.name}
                    </p>
                    <p className="categoryListingPrice">
                        <PriceIcon  
                                width="31px" 
                                height="31px" 
                                style={{ verticalAlign: 'middle' }} 
                                />
                        {listing.offer ? (
                            <>
                                <DiscountOfferIcon 
                                fill="#fb3c04" 
                                width="26px" 
                                height="26px" 
                                style={{ verticalAlign: 'middle' }} 
                                />
                                {listing.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}€
                            </>
                            ) : (
                            `${listing.regularPrice}€`
                        )}
                        { listing.type === 'rent' && ' / Month'}
                    </p>
                    <div className="categoryListingDiv">
                        <p className="categoryListingInfo">
                            <MileageIcon   width="22px"  height="22px" style={{ verticalAlign: 'middle' }}  /> {listing.mileage
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}   {' '}&mdash;{' '}
                            <FuelIcon   width="22px"  height="22px" style={{ verticalAlign: 'middle' }}  /> {listing.fuelType}    {' '}&mdash;{' '}
                            <TransmissionIcon   width="22px"  height="22px" style={{ verticalAlign: 'middle' }}  /> {listing.transmission}
                        </p> 
                    </div>
                </div>
            </Link>
            {onDelete && (
                <DeleteIcon className='removeIcon' fill='rgb(231, 76, 60)' onClick={() => onDelete(listing.id, listing.name)} />
            )}
            {onEdit && <EditIcon className='editIcon' onClick={() => onEdit(id)} />}
        </li>
    );
}

export default ListingItem;