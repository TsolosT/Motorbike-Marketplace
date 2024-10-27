import { ReactComponent as BackIcon } from '../assets/svg/backIcon.svg'; 
import { useNavigate } from 'react-router-dom';

function  ReturnBack() {

    const navigate = useNavigate();
    return ( 
        <div className="backButton" onClick={() => navigate(-1)}>
                <BackIcon width="20px" height="20px" fill="#000" />
                <span>Back</span>
        </div>
    );
}

export default ReturnBack;