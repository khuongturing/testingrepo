const generateUniqueId = (strLength) => {
  if (typeof (strLength) === 'number' && strLength > 0) {
    const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 1; i <= strLength; i += 1) {
      const randomCharacter = possibleCharacter
        .charAt(Math.floor(Math.random() * possibleCharacter.length));
      str += randomCharacter;
    }
    return str;
  }
  return false;
};

export default generateUniqueId;
