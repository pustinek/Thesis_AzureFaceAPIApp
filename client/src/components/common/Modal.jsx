import PropTypes from "prop-types";
import React from 'react';
//Styles:
import styles from './Modal.module.css';

function Modal(props) {

    return (
        <div
            className={styles.modal}
            style={{
                display: props.visible ? "flex" : "none"
            }}

        >
            <div className={styles.modalContent} style={{
                height: props.height,
                width: props.width,
                padding: props.padding,
            }}>
                {props.children}
            </div>
            <div
                className={styles.modalMask}
                onClick={() => props.onClickAway ? props.onClickAway() : null}
            >

            </div>
        </div>
    );
}

Modal.propTypes = {
    visible: PropTypes.bool.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    padding: PropTypes.string,
    onClickAway: PropTypes.func,
}

export default Modal;