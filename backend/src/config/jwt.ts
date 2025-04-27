export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'secreto_super_seguro',
    expiresIn: '7d' , // Expira en 7 días
  };
  