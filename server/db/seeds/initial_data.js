function getRandomShiftHours(min = 6, max = 11) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomShifts(employeeId, numShifts) {
  const shifts = [];
  let currentDate = new Date();
  
  for (let i = 0; i < numShifts; i++) {
    // Set start time to 9 AM of current day
    const punchIn = new Date(currentDate);
    punchIn.setHours(9, 0, 0, 0);
    
    // Calculate random shift duration (mostly around 8 hours)
    const shiftHours = getRandomShiftHours();
    const punchOut = new Date(punchIn);
    punchOut.setHours(punchIn.getHours() + shiftHours);
    
    shifts.push({
      employee_id: employeeId,
      punch_in: punchIn,
      punch_out: punchOut
    });
    
    // Move to previous day for next shift
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return shifts;
}

export async function seed(knex) {
  // First clear existing entries
  await knex('shifts').del();
  await knex('employees').del();

  // Insert employees
  await knex('employees').insert([
    { id: 1, code: '1111', first_name: 'Ahmad', last_name: 'Karimi', title: 'Developer' },
    { id: 2, code: '2222', first_name: 'Luna', last_name: 'Castillo', title: 'Developer' },
    { id: 3, code: '3333', first_name: 'Theo', last_name: 'Everest', title: 'Developer' },
    { id: 4, code: '4444', first_name: 'Anna', last_name: 'Miller', title: 'Developer' },
  ]);

  // Insert shifts
  await knex('shifts').insert([
    // Ahmad Karimi (Employee ID: 1)
    { employee_id: 1, punch_in: '2025-03-10 08:15:00', punch_out: '2025-03-10 16:45:00' },
    { employee_id: 1, punch_in: '2025-03-11 09:00:00', punch_out: '2025-03-11 17:20:00' },
    { employee_id: 1, punch_in: '2025-03-12 10:30:00', punch_out: '2025-03-12 18:15:00' },
    { employee_id: 1, punch_in: '2025-03-13 08:50:00', punch_out: '2025-03-13 17:10:00' },
    { employee_id: 1, punch_in: '2025-03-14 09:30:00', punch_out: '2025-03-14 17:50:00' },
    { employee_id: 1, punch_in: '2025-03-17 08:10:00', punch_out: '2025-03-17 16:40:00' },
    { employee_id: 1, punch_in: '2025-03-18 09:20:00', punch_out: '2025-03-18 17:35:00' },
    { employee_id: 1, punch_in: '2025-03-19 10:00:00', punch_out: '2025-03-19 18:25:00' },
    { employee_id: 1, punch_in: '2025-03-20 08:45:00', punch_out: '2025-03-20 17:05:00' },
    { employee_id: 1, punch_in: '2025-03-21 09:40:00', punch_out: '2025-03-21 18:10:00' },

    // Luna Castillo (Employee ID: 2)
    { employee_id: 2, punch_in: '2025-03-10 07:50:00', punch_out: '2025-03-10 15:30:00' },
    { employee_id: 2, punch_in: '2025-03-11 08:20:00', punch_out: '2025-03-11 16:10:00' },
    { employee_id: 2, punch_in: '2025-03-12 09:10:00', punch_out: '2025-03-12 17:45:00' },
    { employee_id: 2, punch_in: '2025-03-13 07:40:00', punch_out: '2025-03-13 16:00:00' },
    { employee_id: 2, punch_in: '2025-03-14 08:35:00', punch_out: '2025-03-14 16:20:00' },
    { employee_id: 2, punch_in: '2025-03-17 08:00:00', punch_out: '2025-03-17 16:50:00' },
    { employee_id: 2, punch_in: '2025-03-18 09:05:00', punch_out: '2025-03-18 17:15:00' },
    { employee_id: 2, punch_in: '2025-03-19 07:55:00', punch_out: '2025-03-19 16:30:00' },
    { employee_id: 2, punch_in: '2025-03-20 08:45:00', punch_out: '2025-03-20 17:40:00' },
    { employee_id: 2, punch_in: '2025-03-21 09:15:00', punch_out: '2025-03-21 17:50:00' },

    // Theo Everest (Employee ID: 3)
    { employee_id: 3, punch_in: '2025-03-10 09:10:00', punch_out: '2025-03-10 17:40:00' },
    { employee_id: 3, punch_in: '2025-03-11 08:30:00', punch_out: '2025-03-11 16:15:00' },
    { employee_id: 3, punch_in: '2025-03-12 10:00:00', punch_out: '2025-03-12 18:20:00' },
    { employee_id: 3, punch_in: '2025-03-13 07:50:00', punch_out: '2025-03-13 15:55:00' },
    { employee_id: 3, punch_in: '2025-03-14 09:45:00', punch_out: '2025-03-14 18:00:00' },
    { employee_id: 3, punch_in: '2025-03-17 08:20:00', punch_out: '2025-03-17 16:30:00' },
    { employee_id: 3, punch_in: '2025-03-18 09:40:00', punch_out: '2025-03-18 17:50:00' },
    { employee_id: 3, punch_in: '2025-03-19 10:10:00', punch_out: '2025-03-19 18:30:00' },
    { employee_id: 3, punch_in: '2025-03-20 08:35:00', punch_out: '2025-03-20 17:00:00' },
    { employee_id: 3, punch_in: '2025-03-21 07:55:00', punch_out: '2025-03-21 16:20:00' },

    // Anna Miller (Employee ID: 4)
    { employee_id: 4, punch_in: '2025-03-10 08:40:00', punch_out: '2025-03-10 17:10:00' },
    { employee_id: 4, punch_in: '2025-03-11 07:55:00', punch_out: '2025-03-11 15:45:00' },
    { employee_id: 4, punch_in: '2025-03-12 09:30:00', punch_out: '2025-03-12 17:55:00' },
    { employee_id: 4, punch_in: '2025-03-13 08:10:00', punch_out: '2025-03-13 16:20:00' },
    { employee_id: 4, punch_in: '2025-03-14 07:50:00', punch_out: '2025-03-14 15:35:00' },
    { employee_id: 4, punch_in: '2025-03-17 08:55:00', punch_out: '2025-03-17 17:30:00' },
    { employee_id: 4, punch_in: '2025-03-18 10:20:00', punch_out: '2025-03-18 18:40:00' },
    { employee_id: 4, punch_in: '2025-03-19 08:30:00', punch_out: '2025-03-19 16:10:00' },
    { employee_id: 4, punch_in: '2025-03-20 09:05:00', punch_out: '2025-03-20 17:20:00' },
    { employee_id: 4, punch_in: '2025-03-21 07:45:00', punch_out: '2025-03-21 15:55:00' },
  ]);
} 