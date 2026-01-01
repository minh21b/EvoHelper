import * as koffi from "koffi";

// Type for window handle (void pointer)
export type HWND = any;

// Load user32.dll
const user32 = koffi.load("user32.dll");

// Windows API functions
const FindWindowW = user32.func("FindWindowW", "void*", ["void*", "void*"]);
const SendMessageW = user32.func("SendMessageW", "long", [
  "void*",
  "uint",
  "ulong",
  "long",
]);
const PostMessageW = user32.func("PostMessageW", "int", [
  "void*",
  "uint",
  "ulong",
  "long",
]);

// Windows message constants
const WM_KEYDOWN = 0x0100;
const WM_KEYUP = 0x0101;
const WM_CHAR = 0x0102;
const VK_RETURN = 0x0d;

/**
 * Find a window by title
 */
export function findWindowByTitle(title: string): HWND {
  const titleBuffer = Buffer.from(title + "\0", "ucs2");
  const hwnd = FindWindowW(null, titleBuffer);
  return hwnd && hwnd !== 0 ? hwnd : null;
}

/**
 * Send a single key down/up
 */
export function sendKey(hwnd: HWND, vkCode: number) {
  SendMessageW(hwnd, WM_KEYDOWN, vkCode, 0);
  SendMessageW(hwnd, WM_KEYUP, vkCode, 0);
}

/**
 * Send Enter key
 */
export function sendEnter(hwnd: HWND) {
  sendKey(hwnd, VK_RETURN);
}

/**
 * Send a single character asynchronously
 */
export async function sendCharacterAsync(hwnd: HWND, char: string) {
  const charCode = char.charCodeAt(0);
  PostMessageW(hwnd, WM_CHAR, charCode, 0);
}

/**
 * Send a string of characters asynchronously
 */
export async function sendTextAsync(
  hwnd: HWND,
  text: string,
  charDelay: number = 5
) {
  for (const char of text) {
    await sendCharacterAsync(hwnd, char);
    if (charDelay > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, charDelay));
    }
  }
}

/**
 * Send Enter key asynchronously
 */
export async function sendEnterAsync(hwnd: HWND) {
  PostMessageW(hwnd, WM_CHAR, VK_RETURN, 0);
}
