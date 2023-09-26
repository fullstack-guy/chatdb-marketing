export {};

declare global {
  interface Window {
    Paddle: any; // 👈️ turn off type checking
  }
}
