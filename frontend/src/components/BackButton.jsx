import { FaArrowCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Back button should navigate through history instead of URL

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button className='btn btn-reverse btn-back' onClick={() => navigate(-1)}>
      <FaArrowCircleLeft /> Back
    </button>
  );
};

export default BackButton;
