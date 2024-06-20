export const expireTimeFunction = (expire) => {
  let currentTime = Date.now();
  let expireTime = expire;
  if (currentTime > expireTime) return true;
  return false;
};
