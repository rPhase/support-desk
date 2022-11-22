import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';
import NoteItem from '../components/NoteItem';
import Spinner from '../components/Spinner';
import { createNote, getNotes } from '../features/notes/noteSlice';
import { closeTicket, getTicket } from '../features/tickets/ticketSlice';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: '550px',
  },
};

Modal.setAppElement('#root');

const Ticket = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const { ticket } = useSelector((state) => state.ticket);
  const { notes } = useSelector((state) => state.note);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ticketID } = useParams();

  // Can unwrap resolved promise to extract error
  useEffect(() => {
    dispatch(getTicket(ticketID)).unwrap().catch(toast.error);
    dispatch(getNotes(ticketID)).unwrap().catch(toast.error);
  }, [ticketID, dispatch]);

  // Close Ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketID))
      .unwrap()
      .then(() => {
        toast.success('Ticket Closed');
        navigate('/tickets');
      })
      .catch(toast.error);
  };

  // Open/Close Modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Create note
  // Can unwrap resolved promise to extract error
  const onNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(createNote({ noteText, ticketID }))
      .unwrap()
      .then(() => {
        setNoteText('');
        closeModal();
      })
      .catch(toast.error);
  };

  if (!ticket) {
    return <Spinner />;
  }

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <BackButton />
        {!ticket ? (
          <h3>No ticket.</h3>
        ) : (
          <>
            <h2>
              Ticket ID: {ticket._id}
              <span className={`status status-${ticket.status}`}>
                {ticket.status.replace(/^\w/, (c) => c.toUpperCase())}
              </span>
            </h2>
            <h3>
              Date Submitted:{' '}
              {new Date(ticket.createdAt).toLocaleString('en-US')}
            </h3>
            <h3>Product: {ticket.product}</h3>
            <hr />
            <div className='ticket-desc'>
              <h3>Description of Issue</h3>
              <p>{ticket.description}</p>
            </div>
          </>
        )}
        <h2>Notes</h2>
      </header>
      {ticket && ticket.status !== 'closed' && (
        <button className='btn' onClick={openModal}>
          <FaPlus /> Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Add Note'
      >
        <h2>Add Note</h2>
        <button className='btn-close' onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className='form-group'>
            <textarea
              name='noteText'
              id='noteText'
              className='form-control'
              placeholder='Note text'
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className='form-group'>
            <button className='btn' type='submit'>
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notes ? (
        notes.map((note) => <NoteItem key={note._id} note={note} />)
      ) : (
        <Spinner />
      )}

      {ticket && ticket.status !== 'closed' && (
        <button
          className='btn btn-block btn-danger btn-danger'
          onClick={onTicketClose}
        >
          Close Ticket
        </button>
      )}
    </div>
  );
};
export default Ticket;
