import { useState, useEffect } from 'react';
import { getContact, getContacts } from '../actions/contactsActions';
import { ContactType } from '../actions/types';
import Contacts from './Contacts';
import Contact from './Contact';

export const contactInitState: ContactType = {
  id: null,
  firstName: '',
  lastName: '',
  emails: [] as string[],
};

const itemsPerPage = 20;

const App = () => {
  const [page, setPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [contacts, setContacts] = useState([] as ContactType[]);
  const [contact, setContact] = useState(contactInitState);
  const [contactToDisplay, setContactToDisplay] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loadingContact, setLoadingContact] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    handleGetContacts();
  }, [page]);

  useEffect(() => {
    if (contactToDisplay) {
      // Could've get this contact from contacts array
      handleGetContact(contactToDisplay);
    } else {
      clearContact();
    }
  }, [contactToDisplay]);

  const handleGetContacts = () => {
    setLoadingContacts(true);
    getContacts(page, itemsPerPage)
      .then((result) => {
        clearBackendError();
        setTotalItems(result.totalItems);
        setContacts([...contacts, ...result.contacts]);
      })
      .catch(handleError)
      .finally(() => setLoadingContacts(false));
  };

  const handleGetContact = (contactId: number) => {
    setLoadingContact(true);
    getContact(contactId)
      .then((result) => {
        clearBackendError();
        setContact(result);
      })
      .catch(handleError)
      .finally(() => setLoadingContact(false));
  };

  const clearContact = () => {
    setContact({ ...contactInitState, emails: [] });
  };

  const clearBackendError = () => {
    if (error) setError('');
  };

  const handleError = (e: Error) => {
    setError(e.message);
  };

  const handleRemoveContact = (contactId: number) => {
    const tempContacts = [...contacts];
    const filtered = tempContacts.filter((contact) => contact.id !== contactId);
    setContacts(filtered);
  };

  const handleUpdateContacts = (updatedContact: ContactType) => {
    const tempContacts = [...contacts];
    setContacts(
      tempContacts.map((contact) => {
        if (contact.id === updatedContact.id) {
          return updatedContact;
        }
        return contact;
      })
    );
  };

  const canLoadMore = page * itemsPerPage >= totalItems ? false : true;

  const loadNextPage = () => {
    if (!canLoadMore) return;
    setPage(page + 1);
  };

  return (
    <div className="app-wrapper">
      <div className="app">
        <Contacts
          contacts={contacts}
          contactToDisplay={contactToDisplay}
          setContactToDisplay={setContactToDisplay}
          loadNextPage={loadNextPage}
          canLoadMore={canLoadMore}
          loading={loadingContacts}
        />
        <Contact
          contact={contact}
          setContact={setContact}
          removeContact={handleRemoveContact}
          clearContact={clearContact}
          updateContacts={handleUpdateContacts}
          handleError={handleError}
          clearBackendError={clearBackendError}
          loading={loadingContact}
          setLoading={setLoadingContact}
        />
        {error && <p className="error backend-error">{error}</p>}
      </div>
    </div>
  );
};

export default App;
