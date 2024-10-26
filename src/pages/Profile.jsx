import { getAuth, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import {updateDoc, doc} from 'firebase/firestore';
import {db} from '../firebase.config';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import arrowRightIcon  from '../assets/svg/keyboardArrowRightIcon.svg';
import motorbikeIcon  from '../assets/png/motorbike-explore.png';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'; 

function  Profile() {
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const {name, email} = formData;
    const navigate = useNavigate();

    const onLogout =  () => {
        auth.signOut();
        navigate('/');
    };
    
    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //Update Display Name in db
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
                // Update in Firebase
                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                    name
                });
                toast.success('Update profile details was completed succefully');
            }
        } catch (error) {
            toast.error('Could not update profile details');
        }
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader icon-box">
                    My Profile
                    <PersonOutlineIcon  fill="#2c2c2c" width='42px' height='42px' />
                </p>
                <button type="button" onClick={onLogout} className="logOut btn-hover">Logout</button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p className="changePersonalDetails btn-hover" onClick={() => { changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}>
                        {changeDetails ? 'Save Changes' : 'Edit Profile'}
                    </p>
                </div>
                <div className="profileCard">
                    <form >
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />
                        <hr />
                        <label htmlFor="name">Email</label>
                        <input type="text" id="email" className='profileEmail' disabled value={email}  />

                    </form>
                </div>
                
                <Link to='/create-listing' className='createListing'>
                    <img src={motorbikeIcon} alt="Motorbike" height={34}/>
                    <p>Sell or Rent your Motorbike</p>
                    <img src={arrowRightIcon} alt="arrow right" />
                </Link>

                <Link to='/contact' className="contact-link">
                    <p className="contact-text">
                        Any problem or any help needed? Contact with the Developer. 
                        <svg
                            className="arrow-contact-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            >
                            <path d="M10 6l6 6-6 6-1.414-1.414L12.172 12 8.586 8.414z"  fill="currentColor"  />
                        </svg>
                    </p>
                </Link>

            </main>
        </div>
    );
}

export default Profile;