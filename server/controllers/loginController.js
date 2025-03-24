import dotenv from 'dotenv';
dotenv.config();

export const loginController = {
    async handleLogin(req, res) {
        const { username, password } = req.body;

        // Compare with environment variables
        if (username === process.env.ADMIN_USER && 
            password === process.env.ADMIN_PASSWORD) {
            return res.json({
                success: true
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
}; 