import { db } from '../db/db.js';

export const shiftController = {
    async getShifts(req, res) {
        try {
            const { start, end, employee_id } = req.query;
            
            let query = db('shifts')
                .join('employees', 'shifts.employee_id', 'employees.id')
                .select(
                    'shifts.*',
                    db.raw('CONCAT(employees.first_name, " ", employees.last_name) as employee_name')
                )
                .whereBetween('punch_in', [start, end]);

            if (employee_id && employee_id !== 'all') {
                query = query.where('employee_id', employee_id);
            }

            const shifts = await query.orderBy('punch_in');
            res.json(shifts);
        } catch (error) {
            console.error('Error fetching shifts:', error);
            res.status(500).json({ error: 'Failed to fetch shifts' });
        }
    },

    async updateShift(req, res) {
        try {
            const { id } = req.params;
            const { punch_in, punch_out } = req.body;

            await db('shifts')
                .where({ id })
                .update({
                    punch_in,
                    punch_out
                });

            const updatedShift = await db('shifts')
                .where({ id })
                .first();

            res.json(updatedShift);
        } catch (error) {
            console.error('Error updating shift:', error);
            res.status(500).json({ error: 'Failed to update shift' });
        }
    },

    async deleteShift(req, res) {
        try {
            const { id } = req.params;
            await db('shifts').where({ id }).del();
            res.json({ message: 'Shift deleted successfully' });
        } catch (error) {
            console.error('Error deleting shift:', error);
            res.status(500).json({ error: 'Failed to delete shift' });
        }
    },

    async addShift(req, res) {
        try {
            const { employee_id, punch_in, punch_out } = req.body;
            
            // Log the received data
            console.log('Received shift data:', {
                employee_id,
                punch_in,
                punch_out
            });

            // Convert ISO strings to MySQL datetime format
            const formatDateTime = (dateString) => {
                const date = new Date(dateString);
                return date.toISOString().slice(0, 19).replace('T', ' ');
            };

            const formattedData = {
                employee_id,
                punch_in: formatDateTime(punch_in),
                punch_out: formatDateTime(punch_out)
            };

            // Log the formatted data
            console.log('Formatted data for MySQL:', formattedData);

            // First insert the shift with formatted datetime values
            const result = await db('shifts')
                .insert(formattedData);

            console.log('Insert result:', result);

            // Then fetch the newly created shift with employee name
            const newShift = await db('shifts')
                .join('employees', 'shifts.employee_id', 'employees.id')
                .select(
                    'shifts.*',
                    db.raw('CONCAT(employees.first_name, " ", employees.last_name) as employee_name')
                )
                .where('shifts.id', result[0])
                .first();

            console.log('Fetched new shift:', newShift);

            if (!newShift) {
                throw new Error('Failed to fetch created shift');
            }

            res.status(201).json(newShift);
        } catch (error) {
            console.error('Detailed error in addShift:', {
                message: error.message,
                stack: error.stack,
                sqlMessage: error.sqlMessage
            });
            res.status(500).json({ error: 'Failed to add shift' });
        }
    }
}; 