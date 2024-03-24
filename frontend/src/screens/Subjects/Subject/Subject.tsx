import { Box } from '@mui/material';
import React from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const Subject = (props: Props) => {
    const {subjectId}=useParams();


  return (
    <Box>
        Subject {subjectId}
    </Box>
  )
}

export default Subject