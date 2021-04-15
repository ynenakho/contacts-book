import { FC } from 'react';
import { ContactType } from '../actions/types';
import CircleButton from './common/CircleButton';

interface Props {
  contacts: ContactType[];
  contactToDisplay: number | null;
  setContactToDisplay: (id: number | null) => void;
  loadNextPage: () => void;
  canLoadMore: boolean;
  loading: boolean;
}

const Contacts: FC<Props> = ({
  contacts,
  contactToDisplay,
  setContactToDisplay,
  loadNextPage,
  canLoadMore,
  loading,
}) => {
  const handleClearContact = () => {
    setContactToDisplay(null);
  };

  return (
    <div className="contacts">
      <div className="title-wrapper">
        <p className="title">Contacts</p>
        <CircleButton handleClick={handleClearContact} classes="circle-bg" />
      </div>
      <div className="list">
        {contacts.map((contact) => {
          const handleClick = () => {
            setContactToDisplay(contact.id ? contact.id : null);
          };

          const getSelected = `list-element${
            contact.id === contactToDisplay ? ' selected-element' : ''
          }`;

          return (
            <div key={contact.id} className={getSelected} onClick={handleClick}>
              <p>
                {contact.firstName} {contact.lastName}
              </p>
            </div>
          );
        })}
        <div className="load-more-wrapper">
          {!loading ? (
            <p
              onClick={loadNextPage}
              className={`load-more-button${
                !canLoadMore ? ' load-more-disabled' : ''
              }`}
            >
              Load more
            </p>
          ) : (
            <div className="loader" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
