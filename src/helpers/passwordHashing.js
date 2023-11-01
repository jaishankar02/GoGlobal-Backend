import bcrypt from 'bcrypt';

class passwordOperation {
    // Function to hash password
    static hashPassword = async (password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        }
        catch (error) {
            console.log(error);
        }
    }
    // Function to compare hashed password with password provided during Login
    static comparePassword = async (password, hashPassword) => {
        try {
            let isPasswordCorrect = await bcrypt.compare(password, hashPassword);
            return isPasswordCorrect;
        }
        catch (error) {
            console.log(error);
        }
    }
}

export default passwordOperation;