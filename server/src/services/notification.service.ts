
export const sendOrderConfirmation = async (email: string, orderId: string) => {
    // In a real app, integrate Resend/SendGrid/Nodemailer here
    console.log(`[NOTIFICATION-MOCK] Sending Order Confirmation Email to ${email} for Order #${orderId}`);
};

export const sendStatusUpdate = async (email: string, orderId: string, status: string) => {
    // In a real app, integrate SMS/Email service here
    console.log(`[NOTIFICATION-MOCK] Sending Status Update (${status}) to ${email} for Order #${orderId}`);
};
