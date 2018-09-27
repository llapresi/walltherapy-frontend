import React from 'react';

const NewSnackbar = ({message, show}) => {
  let style = 'mdc-snackbar';
  if (show === true) {
    style = `${style} mdc-snackbar--active`;
  }
  return (
    <div
      className={style}
      aria-live="assertive"
      aria-atomic="true"
      aria-hidden="true"
    >
      <div className="mdc-snackbar__text">{message}</div>
    </div>
  );
}

export default NewSnackbar;
