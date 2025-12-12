
import bcrypt from 'bcryptjs';
import prisma from '../../utils/prisma';
import { signToken } from '../../utils/jwt';
import { Role } from '@prisma/client';

export const register = async (email: string, password: string, name: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: Role.CUSTOMER,
        },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};


// Get user profile with addresses
export const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            addresses: true
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Update user profile
export const updateProfile = async (
    userId: string,
    data: { name?: string; email?: string }
) => {
    // If email is being changed, check if it's already taken
    if (data.email) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error('Email already in use');
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        include: {
            addresses: true
        }
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
};

// Change password
export const changePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    return { message: 'Password updated successfully' };
};
