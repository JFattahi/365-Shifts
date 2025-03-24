import { db } from '../db/db.js';

export const punchController = {
    async handlePunch(req, res) {
        const { code } = req.body;
        
        try {
            // Add console.log to debug
            console.log('Received code:', code);

            // First check if employee exists
            const employee = await db('employees')
                .where('code', code.toString()) // Convert code to string to ensure matching
                .first();

            console.log('Found employee:', employee); // Debug log

            if (!employee) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid code'
                });
            }

            // Check for open shift
            const openShift = await db('shifts')
                .where({
                    employee_id: employee.id,
                    punch_out: null
                })
                .first();

            const currentTime = new Date();

            if (openShift) {
                // Punch out
                await db('shifts')
                    .where({ id: openShift.id })
                    .update({
                        punch_out: currentTime
                    });

                return res.json({
                    success: true,
                    isPunchIn: false,
                    message: 'Punch out successful'
                });
            } else {
                // Punch in
                await db('shifts').insert({
                    employee_id: employee.id,
                    punch_in: currentTime,
                    punch_out: null
                });

                return res.json({
                    success: true,
                    isPunchIn: true,
                    message: 'Punch in accepted'
                });
            }

        } catch (error) {
            console.error('Punch error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}; 