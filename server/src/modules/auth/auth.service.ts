
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
    return { user, token };
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
    return { user, token };
};
