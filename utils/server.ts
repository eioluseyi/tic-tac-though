export const generateString = () => {
  var chars = "abcdefghijklmnopqrstuvwxyz";
  var str = "";
  for (var i = 0; i < 3; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  str += "-";
  for (var i = 0; i < 4; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  str += "-";
  for (var i = 0; i < 3; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};
