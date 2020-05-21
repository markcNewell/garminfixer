import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes} from '@fortawesome/free-solid-svg-icons'
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import theme from '../theme'





const drawerWidth = '200px';

const useStyles = makeStyles({
    root: {
        marginLeft: 50,
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
});



const ConsoleNav = ({onSave}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const openDraw = () => {
        setOpen(true);
    };
    const closeDraw = () => {
        setOpen(false);
    };

    

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

                </ul>

            </Drawer>
        </React.Fragment>
    );

};

export default ConsoleNav;