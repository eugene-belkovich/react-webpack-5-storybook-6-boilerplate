import React from 'react';

interface ButtonProps {
  icon: string;
  disabled?: boolean;
  loading?: boolean;
  theme?: string;
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  icon,
  disabled,
  loading,
  onClick,
  children,
  theme = '',
}: ButtonProps) => (
  <p key="Fetch" className="control">
    {/* @ts-ignore */}
    <a className={`button ${theme} ${loading && 'is-loading'}`} disabled={disabled} onClick={onClick}>
      <span>{children}</span>
    </a>
  </p>
);

export default Button;
