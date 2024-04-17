import React, { useEffect, useState } from 'react'
import { Assignment } from '../../context/AssignmentContextProvider'
import axios from 'axios'
import getCommonOptions from '../../helpers/getCommonOptions'

type Props = {}

const Calendar = (props: Props) => {
    const [assignments,setAssignment]=useState<Assignment[]>([])
    useEffect(()=>{
        const getData=async ()=>{
            axios.get(import.meta.env.VITE_BACKEND_URL+'/assignments/getAssignmentWithDeadlines',getCommonOptions())
            .then((response)=>{
                setAssignment(response.data)
                console.log(response.data)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        getData();
    },[])



  return (
    <div>Calendar</div>
  )
}

export default Calendar