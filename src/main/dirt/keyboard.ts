import {
  sendEnter,
  sendTextAsync,
  findWindowByTitle,
} from "./sendinput";

const TARGET_WINDOW = "Warcraft III";

export async function executeCommand(command: string) {
  const hwnd = findWindowByTitle(TARGET_WINDOW);
  if (!hwnd) {
    console.log("❌ Warcraft window not found");
    return;
  }

  sendEnter(hwnd);
  await delay(20);

  // Type command
  await sendTextAsync(hwnd, command, 5);
  await delay(command.length * 5 + 30);

  await delay(20);
  sendEnter(hwnd);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
