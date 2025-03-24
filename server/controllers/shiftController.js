import { db } from '../db/db.js';

export const shiftController = {
    async getShifts(req, res) {
        try {
            const { start, end, employee_id } = req.query;
            console.log('Query params:', { start, end, employee_id });
            
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
            console.log('Fetched shifts:', shifts);
            res.json(shifts);
        } catch (error) {
            console.error('Error fetching shifts:', error);
            res.status(500).json({ error: 'Failed to fetch shifts' });
        }
    },

    async addShift(req, res) {
        try {
            const { employee_id, punch_in, punch_out } = req.body;
            console.log('Received shift data:', { employee_id, punch_in, punch_out });

            // Format dates for MySQL
            const formatDateTime = (dateString) => {
                return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
            };

            const shiftData = {
                employee_id: parseInt(employee_id),
                punch_in: formatDateTime(punch_in),
                punch_out: formatDateTime(punch_out)
            };

            console.log('Formatted shift data:', shiftData);

            // Insert the shift
            const [insertId] = await db('shifts').insert(shiftData);

            // Fetch the created shift with employee name
            const newShift = await db('shifts')
                .join('employees', 'shifts.employee_id', 'employees.id')
                .select(
                    'shifts.*',
                    db.raw('CONCAT(employees.first_name, " ", employees.last_name) as employee_name')
                )
                .where('shifts.id', insertId)
                .first();

            console.log('Created shift:', newShift);
            res.status(201).json(newShift);
        } catch (error) {
            console.error('Error adding shift:', error);
            res.status(500).json({ error: 'Failed to add shift' });
        }
    },

    async updateShift(req, res) {
        try {
            const { id } = req.params;
            const { punch_in, punch_out } = req.body;

            const formatDateTime = (dateString) => {
                return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
            };

            await db('shifts')
                .where({ id })
                .update({
                    punch_in: formatDateTime(punch_in),
                    punch_out: formatDateTime(punch_out)
                });

            const updatedShift = await db('shifts')
                .join('employees', 'shifts.employee_id', 'employees.id')
                .select(
                    'shifts.*',
                    db.raw('CONCAT(employees.first_name, " ", employees.last_name) as employee_name')
                )
                .where('shifts.id', id)
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
    }
}; 