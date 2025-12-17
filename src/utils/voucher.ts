export const generateCodeVoucher = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let code = "";

  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * chars.length);
    code += chars[rand];
  }

  return code;
};
