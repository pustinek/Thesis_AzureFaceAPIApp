import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Button.module.css';
const Button = ({onClick, buttonType, type, disabled,children, width}) => {
    return (
        <button 
        onClick={(e) => onClick(e)}
        className={classNames(
            styles.button,
            styles[buttonType]
        )}
        style={{width: width}}
        >
             {children}
            
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    buttonType: PropTypes.oneOf([
        'primary',
        'warning',
        'danger',
        'success'
    ]),
    buttonSize: PropTypes.oneOf([
        'small',
        'regular',
        'medium',
        'large'
    ]),
    width: PropTypes.string
  };
  
  Button.defaultProps = {
    textColor: "white",
    bgColor: "blue",
    buttonType: "primary",
    buttonSize: "regular",
  };



export default Button;