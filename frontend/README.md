# AttendFlow

AttendFlow is a web-based employee attendance management system. Employees check in and out, track their attendance history, and request leave; admins manage employee accounts and monitor attendance across the organization.
## Features

### Employee
- Secure login
- Check in / check out with live timestamp tracking
- Personal attendance calendar - weekends and public holidays marked in red
- Click any date to view that day's check-in, check-out, and status
- Monthly summary: present days, late days, absent days, total working hours
- Attendance percentage shown as a progress ring
- Recent activity log (last 5 check-ins/check-outs)
- Leave request submission

### Admin
- Secure login 
- Dashboard with a date picker showing daily attendance for all employees
- Live counts: present, late, on leave, absent
- Create new employee accounts
- Activate / deactivate employee accounts
- Search employees by name, email, or position
- Employee detail page per person:
  - Monthly attendance calendar (present / late / leave / holiday / weekend, color-coded)
  - Daily check-in/check-out record table
  - Monthly summary: present, late, leave, absent, total hours



## Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Tailwind CSS
- react-calendar

