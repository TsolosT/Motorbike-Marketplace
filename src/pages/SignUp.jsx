import { useState } from "react";
import {toast} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import {db} from '../firebase.config';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const {name, email, password} = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth,  email, password);
            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: name
            });
            //Prepare user account without modify current form data
            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            //Send data to db
            await setDoc(doc(db, 'users' , user.uid), formDataCopy);

            navigate('/');
        } catch (error) {
            toast.error('Something went wrong with registration.');
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Register New Account
                    </p>
                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <input type="text" className="nameInput"  placeholder="Name" id="name" value={name} onChange={onChange}/>
                        <input type="email" className="emailInput"  placeholder="Email" id="email" value={email} onChange={onChange}/>
                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className="passwordInput"  placeholder="Password" id="password" value={password} onChange={onChange}/>
                            <img src={visibilityIcon} alt="Show Password" className="showPassword"  onClick={() => setShowPassword((prevState) => !prevState)}/>
                        </div>
                        <div className="signUpBar">
                            <p className="signUpText">
                                Sign Up
                            </p>
                            <button className="signUpButton">
                                <ArrowRightIcon fill="#ffffff" width="34px" heigh="34px"/>
                            </button>
                        </div>
                    </form>
                    {/* Google 0Auth component */}
                    
                    <Link to="/sign-in" className="registerLink"><p style={{ color:'#3f3f3f' }}>Already have account?</p>Sign In Instead</Link>
                </main>
            </div>
        </>
    );
}

export default SignUp;