import { FC } from 'react';

interface Props {
  handleClick: () => void;
  classes: string;
  name: string;
  disabled?: boolean;
}

const Button: FC<Props> = ({ handleClick, classes, name, disabled }) => {
  return (
    <button
      onClick={handleClick}
      className={`button ${classes}`}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
