import { FormControl, ListItemIcon, ListItemText, makeStyles, MenuItem, Select } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
    placeholderText: {
        color: "#CAC9C9"
    }
}));
function SelectDropdown({ name, list, selectedType, setSelectedType, type, resetFilters }) {
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
                >
                    <MenuItem value="" disabled>
                        <ListItemText primary={name} />
                    </MenuItem>
                    {
                        list.map((item, index) => {
                            return (
                                <MenuItem key={index} value={item.distinct}>
                                    <ListItemText primary={item.label || item.distinct} />
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
