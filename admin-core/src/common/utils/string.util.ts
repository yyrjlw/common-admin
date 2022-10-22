const randomStringOptions = [];
//a-z大小写
for (let index = 97; index <= 122; index++) {
  randomStringOptions.push(String.fromCharCode(index));
  randomStringOptions.push(String.fromCharCode(index).toUpperCase());
}
//特殊字符
for (let index = 33; index <= 47; index++) {
  randomStringOptions.push(String.fromCharCode(index));
}

export const randomString = (len: number) => {
  let result = "";
  for (let index = 0; index < len; index++) {
    result +=
      randomStringOptions[
        parseInt(Math.random() * randomStringOptions.length + "")
      ];
  }
  return result;
};
