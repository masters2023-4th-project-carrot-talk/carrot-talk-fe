import { Theme, css } from '@emotion/react';
import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import { Dim } from '../modal/Dim';

type Props = {
  isOpen: boolean;
  currentDim: PopupType | null;
  children: React.ReactNode;
};

export const Alert: FC<Props> = ({ isOpen, currentDim, children }) => {
  return (
    <>
      {isOpen && (
        <>
          {createPortal(
            <div css={alertStyle}>
              <Dim isOpen={currentDim === 'alert'} />
              <div className="alert">{children}</div>
            </div>,
            document.getElementById('root') as HTMLElement,
          )}
        </>
      )}
    </>
  );
};

const alertStyle = (theme: Theme) => {
  return css`
    display: flex;
    width: 393px;
    height: 852px;
    position: absolute;
    inset: 0;
    justify-content: center;
    align-items: center;

    .alert {
      position: relative;
      z-index: 110;
      display: flex;
      width: 336px;
      flex-direction: column;
      align-items: flex-start;
      border-radius: 16px;
      background-color: ${theme.color.neutral.background};
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
  `;
};
