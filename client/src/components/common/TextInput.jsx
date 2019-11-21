import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styles from "./TextInput.module.css";

const TextInput = ({
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

  const [active, setActive] = useState(false);


  return (
    <div className={styles.container}>
      <div className={classnames(
        styles.content,
        (active) ? styles.content__active : "",
        disabled ? styles.content__disabled : ""
      )}>
        {label && <label className={classnames(
          styles.label,
          active ? styles.label__active : styles.label__inactive,
          value ? styles.label__filled : styles.label__inactive
          )}>{label}</label>}
        <input
          className={styles.input}
          placeholder=""
          type={type}
          name={name}
          value={value ? value : ""}
          onChange={onChange}
          disabled={disabled}
          onBlur={() => setActive(false)}
          onFocus={() => setActive(true)}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool
};

TextInput.defaultProps = {
  type: "text",
  disabled: false
};

export default TextInput;
