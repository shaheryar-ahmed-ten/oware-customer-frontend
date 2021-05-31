import { FormControl, makeStyles, MenuItem, Select } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
    placeholderText: {
        color: "#CAC9C9"
    }
}));
function SelectDropdown({ name, list, selectedType, setSelectedType, type }) {
    const classes = useStyles();

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
                    {
                        list.map((item) => {
                            return (
                                <MenuItem value={item.distinct === "All" ? '' : item.distinct}>
                                    {item.distinct === "All" ? `${item.distinct} ${type}` : item.distinct}
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
