import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { DropzoneArea } from 'material-ui-dropzone'




function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modelText: {
    textAlign: "center"
  }
}));

export default function Overlay({onUpload, open, setOpen}) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);


  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (file) => {
    if (file.length > 0) {
      if (onUpload(file)) {
        handleClose();
      }
    }
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <DropzoneArea
          onChange={onChange}
          acceptedFiles={[".gpx", ".fit"]}
          filesLimit={1}
      />
      <p id="simple-modal-description" className={classes.modelText}>
        Upload your .gpx or .fit file here
      </p>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        disableBackdropClick={true}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
