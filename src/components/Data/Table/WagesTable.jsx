import React, { useMemo } from 'react';
import {
    Container,
} from 'reactstrap';
import TableContainer from './TableContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SelectColumnFilter } from './filters';


import Wages from './Wages.json'

const WagesTable = () => {

    const columns = useMemo(
        () => [
            {
                Header: 'Area',
                accessor: 'area_title',
                disableSortBy: true,
                Filter: SelectColumnFilter,
                filter: 'equals',
            },
            {
                Header: 'Title',
                accessor: 'occ_title',
                disableFilters: true,

            },
            {
                Header: 'Total Employment',
                accessor: 'tot_emp',
                disableFilters: true,
                Cell: props => new Intl.NumberFormat().format(props.value)


            },
            {
                Header: 'Jobs/1000',
                accessor: 'jobs_1000',
                disableFilters: true,

            },
            {
                Header: 'Hourly Mean',
                accessor: 'h_mean',
                disableFilters: true,
                Cell: props => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD' }).format(props.value)


            },
            {
                Header: 'Annual Mean',
                accessor: 'a_mean',
                disableFilters: true,
                Cell: props => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD' }).format(props.value)

            },
            {
                Header: 'Annual 25th (%)',
                accessor: 'a_pct25',
                disableFilters: true,
                Cell: props => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD' }).format(props.value)

            },
            {
                Header: 'Annual 75th (%)',
                accessor: 'a_pct75',
                disableFilters: true,
                Cell: props => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD' }).format(props.value)

            },
        ],
        []
    );

    return (
        <Container style={{ marginTop: 100, maxWidth: '90%'}}>
            <TableContainer
                columns={columns}
                data={Wages}
            />
        </Container>
    );
};

export default WagesTable;