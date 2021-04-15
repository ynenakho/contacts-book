import { FC } from 'react';

interface Props {
  handleClick: () => void;
  classes: string;
  name?: string;
}

const CircleButton: FC<Props> = ({ handleClick, classes, name }) => {
  return (
    <button onClick={handleClick} className={`circle-button ${classes}`}>
      {classes !== 'circle-delete' && <div className="vertical" />}
      <div className="vertical horizontal" />
    </button>
  );
};

export default CircleButton;
