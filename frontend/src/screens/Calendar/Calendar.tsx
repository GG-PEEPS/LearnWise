import React, { useEffect, useState } from "react";
import { Assignment } from "../../context/AssignmentContextProvider";
import axios from "axios";
import getCommonOptions from "../../helpers/getCommonOptions";
import { enqueueSnackbar } from "notistack";
import formatHttpApiError from "../../helpers/formatHttpAPIError";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calender.css'; // Import your CSS file

type Props = {};

const localizer = momentLocalizer(moment);

const MyCalendar = ({ assignments }: { assignments: Assignment[] }) => (
  <div>
    <BigCalendar
      localizer={localizer}
      events={assignments.map(assignment => ({
        title: assignment.title,
        start: new Date(assignment.deadline),
        end: new Date(assignment.deadline),
        // You can customize other event properties here
      }))}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      eventPropGetter={() => ({ className: 'event-style' })}
    />
  </div>
);

const Calendar = (props: Props) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/assignments/getAssignmentWithDeadlines",
          getCommonOptions()
        );
        setAssignments(response.data);
      } catch (error) {
        enqueueSnackbar(formatHttpApiError(error), { variant: "error" });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Calendar</h1>
      <MyCalendar assignments={assignments} />
    </div>
  );
};

export default Calendar;
