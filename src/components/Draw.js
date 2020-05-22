import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes} from '@fortawesome/free-solid-svg-icons'
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import theme from '../theme';

import { useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';





const drawerWidth = '300px';

const useStyles = makeStyles({
    root: {
        marginLeft: 52,
        letterSpacing: 5,
        position: "relative",
        zIndex: 2
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
        borderBottom: "none",
    },
    list: {
        listStyle: "none",
        paddingLeft: 0,
        display: "inline-block",
    },
    drawerOpen: {
        zIndex: 1,
        background: "#eb6628",
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
    }),
    },
    drawerClose: {
        zIndex: 1,
        background: "#eb6628",
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 4,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    settings: {
        marginLeft: 60,
    },
    text: {
        letterSpacing: 5,
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.75,
        marginTop: 10
    },
    slider: {
        margin: "20px 0px 20px 20px",
        width: 180,
    },
    mark: {
        color: "#ACACAC"
    }
});


const marks = [
  {
    value: 0,
    label: 'none',
  },
  {
    value: 100,
    label: '100',
  },
  {
    value: 200,
    label: 'max',
  },
];

function valuetext(value) {
  return `${value}°C`;
}

const ConsoleNav = ({onSave, step, setStep}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    //const history = useHistory();


    const openDraw = () => {
        setOpen(true);
    };
    const closeDraw = () => {
        setOpen(false);
    };
    const redirect = () => {
        //history.push("http://github.com/markcNewell");
    }
    const updateStep = (e,v) => {
        setStep(v);
    }

    

    return (
        <React.Fragment>
            <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton  onClick={open ? closeDraw : openDraw}>
                        { !open ? [
                            <FontAwesomeIcon icon={faBars} />
                        ] : [
                            <FontAwesomeIcon icon={faTimes}/>
                        ]
                        }
                    </IconButton>
                </div>
                <ul className={ classes.list }>

                    <li>
                        <Button color="inherit" classes={{ root: classes.root }} onClick={onSave}>Save</Button>
                    </li>

                    <Divider variant="inset" component="li" />
                    <li className={ classes.settings }>
                        <Typography color="inherit" className={ classes.text } >SETTINGS</Typography>
                    </li>
                    <li className={ classes.settings }>
                        <Typography color="inherit" className={ classes.text } >MARKERS</Typography>
                        <Slider
                            classes={ { root: classes.slider, markLabel: classes.mark  } }
                            value={step}
                            getAriaValueText={valuetext}
                            aria-labelledby="discrete-slider-custom"
                            step={10}
                            valueLabelDisplay="auto"
                            marks={marks}
                            onChange={updateStep}
                        />
                    </li>
                    <Divider variant="inset" component="li" />

                    <li>
                        <Button color="inherit" classes={{ root: classes.root }} onClick={redirect}>Documentation</Button>
                    </li>

                </ul>

            </Drawer>
        </React.Fragment>
    );

};

export default ConsoleNav;