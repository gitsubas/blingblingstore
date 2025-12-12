
import prisma from '../../utils/prisma';

// Get all addresses for a user
export const getAddresses = async (userId: string) => {
    return await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' } // Default addresses first
    });
};

// Create a new address
export const createAddress = async (
    userId: string,
    data: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault?: boolean;
    }
) => {
    // If this is set as default, unset all other default addresses
    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false }
        });
    }

    return await prisma.address.create({
        data: {
            ...data,
            userId
        }
    });
};

// Update an address
export const updateAddress = async (
    addressId: string,
    userId: string,
    data: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        isDefault?: boolean;
    }
) => {
    // Verify address belongs to user
    const address = await prisma.address.findUnique({
        where: { id: addressId }
    });

    if (!address || address.userId !== userId) {
        throw new Error('Address not found or unauthorized');
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true, id: { not: addressId } },
            data: { isDefault: false }
        });
    }

    return await prisma.address.update({
        where: { id: addressId },
        data
    });
};

// Delete an address
export const deleteAddress = async (addressId: string, userId: string) => {
    // Verify address belongs to user
    const address = await prisma.address.findUnique({
        where: { id: addressId }
    });

    if (!address || address.userId !== userId) {
        throw new Error('Address not found or unauthorized');
    }

    return await prisma.address.delete({
        where: { id: addressId }
    });
};

// Set an address as default
export const setDefaultAddress = async (addressId: string, userId: string) => {
    // Verify address belongs to user
    const address = await prisma.address.findUnique({
        where: { id: addressId }
    });

    if (!address || address.userId !== userId) {
        throw new Error('Address not found or unauthorized');
    }

    // Unset all other default addresses
    await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
    });

    // Set this address as default
    return await prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true }
    });
};
