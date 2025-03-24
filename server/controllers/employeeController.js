import { db } from '../db/db.js';

export const employeeController = {
    // Get all employees
    async getAllEmployees(req, res) {
        try {
            const employees = await db('employees')
                .select('*')
                .orderBy('id');
            
            res.json(employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({ error: 'Failed to fetch employees' });
        }
    },

    // Add new employee
    async addEmployee(req, res) {
        try {
            const { first_name, last_name, code, title } = req.body;

            // Check if code already exists
            const existingEmployee = await db('employees')
                .where({ code })
                .first();

            if (existingEmployee) {
                return res.status(400).json({ error: 'Employee code already exists' });
            }

            const [newEmployee] = await db('employees')
                .insert({
                    first_name,
                    last_name,
                    code,
                    title
                })
                .returning('*');

            res.status(201).json(newEmployee);
        } catch (error) {
            console.error('Error adding employee:', error);
            res.status(500).json({ error: 'Failed to add employee' });
        }
    },

    // Update employee
    async updateEmployee(req, res) {
        try {
            const { id } = req.params;
            const { first_name, last_name, code, title } = req.body;

            // Check if code already exists for different employee
            const existingEmployee = await db('employees')
                .where({ code })
                .whereNot({ id })
                .first();

            if (existingEmployee) {
                return res.status(400).json({ error: 'Employee code already exists' });
            }

            // Update without using returning clause
            await db('employees')
                .where({ id })
                .update({
                    first_name,
                    last_name,
                    code,
                    title
                });

            // Fetch the updated employee separately
            const updatedEmployee = await db('employees')
                .where({ id })
                .first();

            if (!updatedEmployee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.json(updatedEmployee);
        } catch (error) {
            console.error('Error updating employee:', error);
            res.status(500).json({ error: 'Failed to update employee' });
        }
    },

    // Delete employee
    async deleteEmployee(req, res) {
        try {
            const { id } = req.params;

            // First delete related shifts
            await db('shifts')
                .where({ employee_id: id })
                .del();

            // Then delete the employee
            const deleted = await db('employees')
                .where({ id })
                .del();

            if (!deleted) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.json({ message: 'Employee deleted successfully' });
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({ error: 'Failed to delete employee' });
        }
    }
}; 