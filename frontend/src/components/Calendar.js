// src/components/Calendar.js
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Thiết lập localizer cho moment
const localizer = momentLocalizer(moment);

const MyCalendar = ({ events, onSelectDate }) => {
    return (
        <div>
            <h2>Lịch</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                onSelectSlot={onSelectDate} // Gọi hàm khi người dùng chọn một ngày
                selectable  
                eventPropGetter={(event) => {
                    return {
                        style: {
                            color: event.color, backgroundColor: '#f5f6fa' // Màu nền dựa trên số dư
                        },
                    };
                }}
            />
        </div>
    );
};

export default MyCalendar;