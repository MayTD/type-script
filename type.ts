const dummyTexts = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Donec tortor odio, aliquam eu nulla at, ultrices ornare magna.",
  "Nulla accumsan ex ut dictum lobortis.",
  "Ut suscipit ullamcorper ligula, sed cursus mauris dignissim in.",
  "Aenean non ligula a arcu tincidunt molestie.",
  "Praesent pulvinar lorem quis nisi mattis, a ornare dui eleifend.",
  "In at erat at metus aliquam bibendum.",
  "Duis maximus leo nec augue interdum convallis.",
  "Etiam quis egestas metus.",
  "Donec dapibus feugiat finibus.",
  "Morbi pellentesque pellentesque felis, sit amet fringilla est dictum vitae.",
  "In hac habitasse platea dictumst.",
  "Etiam dapibus purus non egestas ullamcorper.",
  "Quisque venenatis convallis nisl at maximus.",
  "Aliquam quis sapien in sapien efficitur fringilla.",
  "Mauris vel est eleifend, accumsan arcu pharetra, tincidunt lectus.",
  "Nulla malesuada porta lacus eu consequat.",
  "Vestibulum et leo fringilla, volutpat massa nec, malesuada eros.",
  "Nulla cursus risus nec ligula laoreet consectetur.",
  "Fusce sit amet arcu congue, finibus est placerat, vehicula erat.",
  "Sed molestie purus sit amet turpis convallis, non consequat nunc molestie.",
  "Etiam neque metus, malesuada vel pellentesque ac, dignissim vel sapien.",
  "Duis lectus ante, pharetra nec hendrerit condimentum, vestibulum et ipsum.",
  "Aenean in tempus turpis.",
  "Sed rutrum est pharetra nulla porta fermentum.",
  "Fusce ac volutpat est.",
  "Praesent placerat libero non neque tristique, non rutrum diam aliquet.",
  "Fusce non cursus ex.",
  "Vivamus sodales, nibh eu mattis eleifend, lacus i…alesuada erat, vel aliquam neque ipsum sed lacus.",
  "Aliquam imperdiet ut quam eu faucibus.",
  "Praesent dictum neque ante, sit amet bibendum arcu eleifend sed.",
  "Pellentesque ullamcorper at purus ac iaculis.",
  "Suspendisse tincidunt purus in mi sollicitudin varius.",
  "Sed elementum ac arcu vitae sagittis.",
];

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

const testText = dummyTexts[Math.floor(Math.random() * dummyTexts.length)],
  blue = "\x1b[36m",
  red = "\x1b[31m",
  resetColor = "\x1b[0m",
  grey = "\x1b[90m";

let charactersTyped: number = 0,
  totalTypos = 0,
  time: number = 0,
  typoDisplayIndexes: Array<number> = [],
  endTest: boolean = false;

const calculateAccuracy = () => {
  const inaccurate = totalTypos / charactersTyped;
  const accuracy = ((1 - inaccurate || 0) * 100).toFixed();
  return { accuracy };
};

const timer = () => {
  function callback() {
    time++;
    if (endTest) {
      const { accuracy } = calculateAccuracy();
      process.stdout.write(
        `\nAccuracy: ${accuracy}%\nCharacters Typed: ${charactersTyped}\nTypos: ${totalTypos}\nTime: ${time}s\n`
      );
      process.exit();
    }
  }
  callback();
  setInterval(callback, 1000);
};

const printDisplay = () => {
  const typedDisplay = testText
    .slice(0, charactersTyped)
    .split("")
    .reduce((typedDisplay, char, i) => {
      if (typoDisplayIndexes.includes(i)) {
        return typedDisplay + `${red}${char}`;
      }
      return typedDisplay + `${blue}${char}`;
    }, "");
  const display = `\r${typedDisplay}${resetColor}${testText.slice(
    charactersTyped,
    testText.length
  )}`;
  process.stdout.write(display);
};

const testTyping = (
  char: string,
  keyboardEvent: {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
  }
) => {
  if (keyboardEvent.ctrl && keyboardEvent.name === "c") {
    process.exit();
  } else if (keyboardEvent.name === "backspace") {
    const typoIndex = typoDisplayIndexes.indexOf(charactersTyped - 1);
    if (typoIndex >= 0) {
      typoDisplayIndexes.splice(typoIndex, 1);
    }
    if (charactersTyped > 0) {
      charactersTyped--;
    }
  } else {
    charactersTyped++;
    if (char !== testText[charactersTyped - 1]) {
      totalTypos++;
      typoDisplayIndexes.push(charactersTyped - 1);
    }
    if (charactersTyped == testText.length) {
      endTest = true;
      process.stdin.off("keypress", testTyping);
    }
  }

  printDisplay();
};

const main = () => {
  process.stdout.write(
    `Test your typing accuracy! Press any key to start.\n${grey}${testText}`
  );
  process.stdin.once("keypress", timer);
  process.stdin.on("keypress", testTyping);
};

main();
