import { FormControl, InputAdornment, ListItemIcon, ListItemText, makeStyles, MenuItem, MenuList, Select } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
    placeholderText: {
        color: "#CAC9C9"
    },
    dropdownListItem: {
        '& .MuiListItemText-primary	': {
            fontSize: 12,
        }
    }
}));
function SelectDropdown({ name, list, selectedType, setSelectedType, icon, resetFilters }) {
    const classes = useStyles();

    const handleChange = (event) => {
        resetFilters()
        setSelectedType(event.target.value);
    };
    return (
        <>
            <FormControl className={classes.formControl}>
                <Select
                    value={selectedType}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    className={classes.placeholderText}
                    startAdornment={
                        <InputAdornment position="start">
                            {icon}
                        </InputAdornment>
                    }
                >
                    <MenuItem value={null} disabled>
                        <ListItemText primary={name} classes={{root:classes.dropdownListItem}} />
                    </MenuItem>

                    {
                        list.map((item, index) => {
                            return (
                                <MenuItem key={index} value={item.id}>
                                    <ListItemText primary={item.name || ''} classes={{root:classes.dropdownListItem}} />
                                </MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        </>
    )
}

export default SelectDropdown
