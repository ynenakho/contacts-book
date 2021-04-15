import { FC } from 'react';

type Props = {
  onClose: () => void;
  show: boolean;
  text: string;
};

const Modal: FC<Props> = ({ onClose, show, text }) => {
  return (
    <div className={`modal-wrapper ${!show ? 'modal-wrapper-hide' : ''}`}>
      <div className={`modal ${!show ? 'modal-hide' : ''}`}>
        <h2>{text}</h2>
        <button className="button save-button modal-button" onClick={onClose}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default Modal;
