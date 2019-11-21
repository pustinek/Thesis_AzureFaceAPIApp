import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './InputGroup.module.css';

const InputGroup = ({
  name,
  placeholder,
  value,
  error,
  icon,
  label,
  type,
  onChange,
  disabled
}) => {
  return (
    
    <div className={styles.input__container}>
      <div className={styles.input__prepend}>
        <span className={styles.input__text}>
          <i className={icon} />
        </span>
      </div>
      {label && <label>{label}</label>}
      <input
        className={classnames('form-control form-control-lg', {
          'is-invalid': error
        }, styles.input)}
        placeholder={placeholder}
        name={name}
        value={value ? value : ""}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

InputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool
};

InputGroup.defaultProps = {
  type: 'text',
  disabled: false
};

export default InputGroup;