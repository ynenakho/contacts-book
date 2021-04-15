import { FC, useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import {
  createContact,
  deleteContact,
  putContact,
} from '../actions/contactsActions';
import { ContactType } from '../actions/types';
import Button from './common/Button';
import CircleButton from './common/CircleButton';
import { contactInitState } from './App';
import Modal from './common/Modal';

interface Props {
  contact: ContactType;
  setContact: (contact: ContactType) => void;
  removeContact: (contactId: number) => void;
  updateContacts: (contact: ContactType) => void;
  clearContact: () => void;
  handleError: (e: Error) => void;
  clearBackendError: () => void;
  loading: boolean;
  setLoading: (bool: boolean) => void;
}

const initialError = {
  email: '',
  firstName: '',
  lastName: '',
};

const initialModal = {
  text: '',
  show: false,
};

const Contact: FC<Props> = ({
  contact,
  setContact,
  removeContact,
  clearContact,
  updateContacts,
  handleError,
  clearBackendError,
  loading,
  setLoading,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(initialError);
  const [contactCopy, setContactCopy] = useState(contactInitState);
  const [modal, setModal] = useState(initialModal);

  const copyContact = { ...contact, emails: [...contact.emails] };

  useEffect(() => {
    setContactCopy(copyContact);
  }, [contact.id]);

  const handleCloseModal = () => {
    setModal(initialModal);
  };

  const handleOpenModal = (text: string) => {
    setModal({ text, show: true });
  };

  const handleShowInput = () => {
    setShowInput(true);
  };

  const isCorrectEmail = () => {
    if (!email.length) {
      setError({ ...error, email: 'Email field is required' });
      return false;
    } else if (!/^[^@]+@\w+(\.\w+)+\w$/.test(email)) {
      setError({ ...error, email: 'Incorrect email address' });
      return false;
    } else if (contact.emails.includes(email)) {
      setError({ ...error, email: 'Already have that email on file' });
      return false;
    }
    return true;
  };

  const addEmail = () => {
    if (!isCorrectEmail()) return;
    let tempContact = copyContact;
    tempContact.emails.push(email.toLowerCase());
    setContact(tempContact);
    setEmail('');
    setShowInput(false);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error.email) {
      setError({ ...error, email: '' });
    }
    setEmail(e.currentTarget.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addEmail();
    }
  };

  const handleKeyPressSave = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveContact();
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tempContact = { ...contact };
    if (e.target.id === 'firstName' || e.target.id === 'lastName') {
      tempContact[e.target.id] = e.target.value;
      if (error[e.target.id]) {
        error[e.target.id] = '';
      }
    }
    setContact(tempContact);
  };

  const handleCancel = () => {
    setError(initialError);
    setContact({ ...contactCopy, emails: [...contactCopy.emails] });
  };

  const handleDeleteContact = () => {
    if (contact.id) {
      setLoading(true);
      deleteContact(contact.id)
        .then((result) => {
          if (result && contact.id) {
            clearBackendError();
            removeContact(contact.id);
            clearContact();
            handleOpenModal('Contact deleted');
          }
        })
        .catch(handleError)
        .finally(() => setLoading(false));
    } else {
      clearContact();
    }
  };

  const isInputValid = () => {
    const errorObject = { ...initialError };
    if (!contact.firstName) {
      errorObject.firstName = 'First Name field is required';
    } else if (!/^[A-Za-z]+$/.test(contact.firstName)) {
      errorObject.firstName = 'First Name can only contain english letters';
    }
    if (!contact.lastName) {
      errorObject.lastName = 'Last Name field is required';
    } else if (!/^[A-Za-z]+$/.test(contact.lastName)) {
      errorObject.lastName = 'Last Name can only contain english letters';
    }
    if (errorObject.lastName || errorObject.firstName) {
      setError({ ...error, ...errorObject });
      return false;
    }
    return true;
  };

  const saveContact = () => {
    if (!isInputValid()) return;
    const tempContact = copyContact;
    delete tempContact.id;
    setLoading(true);
    if (contact.id) {
      // Update existing contact
      putContact(contact.id, tempContact)
        .then((result) => {
          setContact(result);
          setContactCopy(result);
          updateContacts(result);
          handleOpenModal('Contact updated');
        })
        .catch(handleError)
        .finally(() => setLoading(false));
    } else {
      // Create new contact
      createContact(tempContact)
        .then((result) => {
          setContact(result);
          setContactCopy(result);
          handleOpenModal('New contact created');
        })
        .catch(handleError)
        .finally(() => setLoading(false));
    }
  };

  const isContactChanged = () =>
    JSON.stringify(contact) !== JSON.stringify(contactCopy);

  const renderInput = () => {
    return (
      <>
        <div className="email-input-wrapper">
          <input
            className="input email-input"
            value={email}
            onChange={handleEmailChange}
            onKeyPress={handleKeyPress}
            autoFocus={true}
          />
          <CircleButton handleClick={addEmail} classes="" />
        </div>
        {error.email && <p className="error">{error.email}</p>}
      </>
    );
  };

  const renderEmail = (email: string, index: number) => {
    const handleDeleteEmail = () => {
      const tempContact = copyContact;
      const index = tempContact.emails.indexOf(email);
      tempContact.emails.splice(index, 1);
      setContact(tempContact);
    };
    return (
      <div className="email-wrapper" key={index}>
        <p className="email">{email}</p>
        <CircleButton handleClick={handleDeleteEmail} classes="circle-delete" />
      </div>
    );
  };

  return (
    <>
      <div className="contact">
        {loading ? (
          <div className="loader" />
        ) : (
          <>
            <div>
              <p className="contact-title">
                {contact.id ? 'Update Existing User' : ' Create New User'}
              </p>
              <div className="inputs-wrapper">
                <div>
                  <label htmlFor="first-name">First Name</label>
                  <input
                    value={contact.firstName}
                    onChange={handleNameChange}
                    onKeyPress={handleKeyPressSave}
                    className="input"
                    id="firstName"
                  />
                  {error.firstName && (
                    <p className="error">{error.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="last-name">Last Name</label>
                  <input
                    value={contact.lastName}
                    onChange={handleNameChange}
                    onKeyPress={handleKeyPressSave}
                    className="input"
                    id="lastName"
                  />
                  {error.lastName && <p className="error">{error.lastName}</p>}
                </div>
              </div>
              <div className="email-container-wrapper">
                <label>Email</label>
                {contact.emails.map((email, index) =>
                  renderEmail(email, index)
                )}
              </div>
              {showInput ? (
                renderInput()
              ) : (
                <div className="add-email-button" onClick={handleShowInput}>
                  <CircleButton handleClick={() => {}} classes="circle-sm" />
                  <p className="add-email-text">add email</p>
                </div>
              )}
            </div>
            <div className="buttons-wrapper">
              <Button
                name="delete"
                handleClick={handleDeleteContact}
                classes="delete-button"
                disabled={!contact.id}
              />
              <div>
                <Button
                  name="cancel"
                  handleClick={handleCancel}
                  classes="cancel-button"
                  disabled={!isContactChanged()}
                />
                <Button
                  name="save"
                  handleClick={saveContact}
                  classes="save-button"
                  disabled={!isContactChanged()}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Modal text={modal.text} show={modal.show} onClose={handleCloseModal} />
    </>
  );
};

export default Contact;
