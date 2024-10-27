import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import {getAuth} from 'firebase/auth';
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ReturnBack from '../components/ReturnBack';

function ContactOwner() {
    const [message, setMessage] = useState('')
    const [owner, setOwner] = useState(null)
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate();
    const auth = getAuth();
    const params = useParams()
    //Redirect if listing is not users
    useEffect(() => {
        if (!auth.currentUser) {
            toast.error("You must sign in first!");
            navigate('/sign-in');
        }
    });
    //Set Onwer data
    useEffect(() => {
        const getOwner = async () => {
            const docRef = doc(db, 'users', params.ownerId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                // console.log(docSnap.data())
                setOwner(docSnap.data())
            } else {
                toast.error('Could not get Owner data')
            }
        }

        getOwner()
        }, [params.ownerId])

    const onChange = (e) => setMessage(e.target.value)

    return (
        <div className='pageContainer'>
            <ReturnBack/>
            <br />
            <header>
                <p className='pageHeader'>Contact Owner</p>
            </header>
            <hr />
            {owner !== null && (
                <main>
                    <div className='contactLandlord'>
                        <p className='landlordName'>Contact {owner?.name}</p>
                    </div>

                    <form className='messageForm'>
                        <div className='messageDiv'>
                            <label htmlFor='message' className='messageLabel'>
                                Message
                            </label>
                            <textarea
                                name='message'
                                id='message'
                                className='textarea'
                                value={message}
                                onChange={onChange}
                            ></textarea>
                        </div>

                        <a
                            href={`mailto:${owner.email}?Subject=${searchParams.get(
                            'listingName'
                            )}&body=${message}`}
                        >
                            <button type='button' className='primaryButton'>
                                Send Message
                            </button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    );
}

export default ContactOwner;