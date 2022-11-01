import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { getTicket, reset, closeTicket } from '../features/tickets/ticketSlice';
import { getNotes, reset as notesReset } from '../features/notes/noteSlice';
import NoteItem from '../components/NoteItem';

const Ticket = () => {
  const { ticket, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.ticket
  );

  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.note
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ticketID } = useParams();

  useEffect(() => {
    dispatch(getTicket(ticketID));
    dispatch(getNotes(ticketID));
    if (isError) {
      toast.error(message);
      return;
    }

    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    };
  }, [isError, message, ticketID, isSuccess, dispatch]);

  // Close Ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketID));
    toast.success('Ticket Closed');
    navigate('/tickets');
  };

  if (isLoading || notesIsLoading) {
    return <Spinner />;
  }

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <BackButton url='/tickets' />
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
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}
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
