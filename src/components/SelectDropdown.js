import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
    placeholderText: {
        color: "#CAC9C9"
    }
}));
function SelectDropdown({ name, list }) {
    const classes = useStyles();
    const [selectedType, setSelectedType] = useState('');

    const handleChange = (event) => {
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
                    <MenuItem value='' disabled>
                        {name}
                    </MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default SelectDropdown
