import { Box, Grid, InputBase, makeStyles, TableContainer, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SelectDropdown from '../../../components/SelectDropdown';
import TableHeader from '../../../components/TableHeader';
import { getURL } from '../../../utils/common';

const useStyles = makeStyles({
    searchInput: {
        border: '1px solid grey',
        borderRadius: 4,
        opacity: 0.6,
        padding: '0px 8px',
        marginRight: 7,
        height: 30,
        width: 300,
        boxSizing: "border-box",
        padding: "10px 10px"
    },
});

function Inbound() {
    const classes = useStyles()
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        // axios.get(getURL(`/inward`))
        // .then((response)=>{
        //     console.log(response)
        // })
        // .catch((err)=>{
        //     console.log(err)
        // })
        // axios.get(getURL(`/inward/relations`))
        // .then((response)=>{
        //     console.log(response)
        // })
        // .catch((err)=>{
        //     console.log(err)
        // })
    }, [])
    const searchInput = <InputBase
        placeholder="Search"
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        placeholder="Warehouse / Product / Reference No."
        onChange={e => setSearchKeyword(e.target.value)}
    />;

    const warehouseSelect = <SelectDropdown name="Select Warehouse" />
    const productSelect = <SelectDropdown name="Select Product" />
    const daysSelect = <SelectDropdown name="Select Days" />
    const headerButtons = [warehouseSelect, productSelect, daysSelect]
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box fontWeight="fontWeightBold">Inwards</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <TableHeader searchInput={searchInput} buttons={headerButtons} />
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    )
}

export default Inbound
