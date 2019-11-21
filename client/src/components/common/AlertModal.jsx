import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { PropTypes } from "prop-types";
import React from "react";
import styles from "./AlertModal.module.css";
const useStyles = makeStyles(theme => ({
  title: {},
  description: {
    color: theme.palette.white
  }
}));

const AlertModal = ({ title, description, type }) => {

  const classes = useStyles();
  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <div className={styles.icon__container}>
        <span className={styles.icon}>
          <i
            className={[
              type === "error" ? "fas fa-exclamation-circle" : "",
              type === "info" ? "fas fa-info-circle" : "",
              type === "success" ? "fas fa-check-circle" : ""
            ].join(" ")}
          />
        </span>
      </div>
      <div className={styles.text__container}>
        
        <Typography
          // variant="h4"
          className={classes.title}
          
        >
          {title}
        </Typography>
        <Typography 
          variant="caption"
          className={classes.description}
          >{description}</Typography>
      </div>
    </div>
  );
};

AlertModal.defaultProps = {
  type: "info"
};
AlertModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  type: PropTypes.string
};

export default AlertModal;
