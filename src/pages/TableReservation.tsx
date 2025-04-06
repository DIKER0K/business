import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function TableReservation() {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid size={8}>
                <Paper>
                    1
                </Paper>
            </Grid>
            <Grid size={4}>
                <Paper>
                    2
                </Paper>
            </Grid>
            <Grid size={4}>
                <Paper>
                    3
                </Paper>
            </Grid>
            <Grid size={8}>
                <Paper>
                    4
                </Paper>
            </Grid>
        </Grid>
    </Box>
  )
}

export default TableReservation
