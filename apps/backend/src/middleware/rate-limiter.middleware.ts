import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10,
  message: { success: false, data: null, error: 'Too many authentication attempts. Terminal locked for 15 minutes.' }
});

export const billingLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds step validation fence
  max: 1, 
  message: { success: false, data: null, error: 'Duplicate transaction processing skipped safely.' }
});