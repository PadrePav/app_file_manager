class MyError {
  static create(message: string, code: number = 555) {
    throw {
      message,
      code
    };
  };
}
export default MyError