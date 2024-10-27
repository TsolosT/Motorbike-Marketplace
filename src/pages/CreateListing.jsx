import { useState, useEffect, useRef } from "react";
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {toast} from 'react-toastify';
import {v4 as uuidv4} from 'uuid';
import ReturnBack from "../components/ReturnBack";

const GEOCODE_API_KEY = import.meta.env.VITE_REACT_APP_GEOCODE_API_KEY;

function CreateListing() {
    const [loading, setLoading] = useState(false);
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [formData, setFormData] = useState({
        type: 'rent',
        offer:false,
        name: '',
        brand:'',
        model:'',
        condition: '',
        year:'',
        fuelType:'petrol',
        transmission: 'manual',
        mileage: 0,
        engineCapacity:0,
        location:'',
        regularPrice:'',
        discountedPrice:'',
        images:{},
        lat:0,
        lng:0
    });
    
    const {type, offer, name, brand, model, condition, year, fuelType, transmission, mileage, engineCapacity, location, regularPrice, discountedPrice, images, lat, lng} = formData;

    const auth = getAuth();
    if (!auth.currentUser) {
        setLoading(false);
        navigate('/');
        toast.error("User is not authenticated");
        return;
    }
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({...formData, userRef: user.uid});
                } else {
                    navigate('/sign-in');
                }
            });
        }

        return () => {
            isMounted.current = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Check if discounted price is valid
        if (discountedPrice >= regularPrice) {
            setLoading(false);
            toast.error('Discounted price must be less than the regular price.');
            return;
        }
    
        // Check the image count
        if (images.length > 6) {
            setLoading(false);
            toast.error('Only up to 6 images can be uploaded.');
            return;
        }
    
        // Geolocation handling
        let geolocation = {};
        let locationText;
    
        if (geolocationEnabled) {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEOCODE_API_KEY}`);
                const data = await response.json();
                geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
                geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
    
                locationText = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address;
                if (!locationText || locationText.includes('undefined')) {
                    setLoading(false);
                    toast.error('Please enter a valid address.');
                    return;
                }
            } catch (error) {
                setLoading(false);
                toast.error('Failed to fetch geolocation.');
                return;
            }
        } else {
            geolocation.lat = lat;
            geolocation.lng = lng;
        }
    
        // Store images in Firebase Storage
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, 'images/' + fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)
        
                uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused')
                        break
                    case 'running':
                        console.log('Upload is running')
                        break
                    default:
                        break
                    }
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                    })
                }
                )
            })
        }
    
        // Upload images and handle errors
        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })
    
        // Prepare data for Firestore submission
        const formDataCopy = {
            ...formData,
            geolocation,
            timestamp: serverTimestamp(),
            imgUrls,
            location: locationText || location, // prefer geocoded location
        };
    
        // Cleanup form data for Firestore
        delete formDataCopy.images; // remove file images
        if (!formDataCopy.offer) delete formDataCopy.discountedPrice; // remove discount if no offer

        try {
            const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
            setLoading(false);
            toast.success('Listing created successfully!');
            navigate(`/category/${formDataCopy.type}/${docRef.id}`);
        } catch (error) {
            setLoading(false);
            toast.error('Failed to create listing.');
            // console.error(error);
        }
    };

    const onMutate = (e) => {
        let boolean = null;

        if (e.target.value === 'true') {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }

        //Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }));
        }
        //Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }));
        }
    };

    
    if (loading) {
        return <Spinner/>
    }

    return ( 
        <div className="profile">
            <ReturnBack/>
            <br />
            <header>
                <p className="pageHeader">
                    Create an Motorbike Offer
                </p>
                <hr />
            </header>
        <main>
            <form onSubmit={onSubmit}>
                <label htmlFor="" className="formLabel">Sell / Rent</label>
                <div className="formButtons">
                    <button type="button" className={type == 'sale' ? 'formButtonActive' : 'formButton'} id='type' value='sale' onClick={onMutate}>
                        Sell
                    </button>
                    <button type="button" className={type == 'rent' ? 'formButtonActive' : 'formButton'} id='type' value='rent' onClick={onMutate}>
                        Rent
                    </button>
                </div>

                <label htmlFor='name' className='formLabel'>Name</label>
                <input
                    className='formInputName'
                    type='text'
                    id='name'
                    value={name}
                    onChange={onMutate}
                    maxLength='32'
                    minLength='4'
                    required
                />

                <div className='formModel flex'>
                    <div>
                        <label htmlFor="brand" className='formLabel'>Brand</label>
                        <input
                            className='formInputSmall'
                            type='text'
                            id='brand'
                            value={brand}
                            onChange={onMutate}
                            maxLength='32'
                            minLength='2'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="model" className='formLabel'>Model</label>
                        <input
                            className='formInputSmall'
                            type='text'
                            id='model'
                            value={model}
                            onChange={onMutate}
                            maxLength='32'
                            minLength='2'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="year" className='formLabel'>Year</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='year'
                            value={year}
                            min="1900"
                            max="2100" 
                            step="1"
                            onChange={onMutate}
                            required
                        />
                    </div>
                </div>
                
                <label htmlFor="fuelType" className='formLabel'>FuelType</label>
                <select
                    className='formInputSmall'
                    id='fuelType'
                    value={fuelType} 
                    onChange={onMutate}  
                    required
                    >
                        <option value="">Select Fuel Type</option>  
                        <option value="petrol">Petrol</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                
                <label className='formLabel' htmlFor="transmission">Transmission</label>
                <select
                    className='formInputSmall'
                    id='transmission'
                    value={transmission}
                    onChange={onMutate}
                    required
                >
                    <option value="">Select Transmission</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                </select>
                    
                <label className='formLabel' htmlFor="mileage">Mileage (in km)</label>
                <input
                    className='formInputSmall'
                    type='number'
                    id='mileage'
                    value={mileage}
                    onChange={onMutate}
                    placeholder="Enter mileage"
                    min="0"
                    required
                />

                <label className='formLabel' htmlFor="engineCapacity">Engine Capacity (in cc)</label>
                <input
                    className='formInputSmall'
                    type='number'
                    id='engineCapacity'
                    value={engineCapacity}
                    onChange={onMutate}
                    placeholder="Enter engine capacity"
                    min="50"  
                    max="2000" 
                    required
                />

                <label htmlFor="condition" className='formLabel'>Condition</label>
                <div className='formButtons'>
                    <button
                        className={condition == 'new' ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='condition'
                        value='new'
                        onClick={onMutate}
                    >
                    New
                    </button>
                    <button
                        className={
                            condition == 'used' && condition !== null
                            ? 'formButtonActive'
                            : 'formButton'
                        }
                        type='button'
                        id='condition'
                        value='used'
                        onClick={onMutate}
                    >
                    Used
                    </button>
                </div>

                
                <label htmlFor='location' className='formLabel'>Location</label>
                <textarea
                    className='formInputAddress'
                    type='text'
                    id='location'
                    value={location}
                    onChange={onMutate}
                    required
                />

                {!geolocationEnabled && (
                    <div className='formLatLng flex'>
                        <div>
                            <label htmlFor="lat" className='formLabel'>Latitude</label>
                            <input
                            className='formInputSmall'
                            type='number'
                            id='lat'
                            value={lat}
                            onChange={onMutate}
                            required
                            />
                        </div>
                        <div>
                            <label htmlFor="lng" className='formLabel'>Longitude</label>
                            <input
                            className='formInputSmall'
                            type='number'
                            id='lng'
                            value={lng}
                            onChange={onMutate}
                            required
                            />
                        </div>
                    </div>
                )}

                <label htmlFor="offer" className='formLabel'>Offer</label>
                <div className='formButtons'>
                    <button
                        className={offer ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='offer'
                        value={true}
                        onClick={onMutate}
                    >
                    Yes
                    </button>
                    <button
                        className={
                            !offer && offer !== null ? 'formButtonActive' : 'formButton'
                        }
                        type='button'
                        id='offer'
                        value={false}
                        onClick={onMutate}
                    >
                    No
                    </button>
                </div>

                <label htmlFor="regularPrice" className='formLabel'>Regular Price</label>
                <div className='formPriceDiv'>
                    <input
                    className='formInputSmall'
                    type='number'
                    id='regularPrice'
                    value={regularPrice}
                    onChange={onMutate}
                    min='50'
                    max='750000000'
                    required
                    />
                    {type === 'rent' ? <p className='formPriceText'>€ / Month</p> : <p>€</p>}
                </div>

                {offer && (
                    <div className='formPriceDiv'>
                        <label htmlFor="discountedPrice" className='formLabel'>Discounted Price</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required={offer}
                        />
                    </div>
                )}

                <label className='formLabel'>Images</label>
                <p className='imagesInfo'>
                    The first image will be the cover (max 6).
                </p>
                <input
                    className='formInputFile'
                    type='file'
                    id='images'
                    onChange={onMutate}
                    max='6'
                    accept='.jpg,.png,.jpeg'
                    multiple
                    required
                />
                <button type='submit' className='primaryButton createListingButton'>
                    Publish Motorbike
                </button>

            </form>
        </main>
        </div>
    );
}

export default CreateListing;