export {};

declare global {
  namespace Response {
    interface ReturnType<T> {
      message: string;
      data: T;
    }
  }
}
