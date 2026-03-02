const { ArrayList } = require("./level1");
const { LinkedStack } = require("./level2");

function hexToDecimal(hexStr) {
  return parseInt(hexStr, 16);
}

function main() {
  console.log("Рівень 3: Список -> Стек\n");

  const list = new ArrayList(10);

  const hexValues = ["1A", "2F", "B4", "0D", "FF", "3C", "7E"];
  for (let i = 0; i < hexValues.length; i++) {
    list.insert(hexValues[i]);
  }

  console.log("Початковий список:");
  list.print();

  console.log("\nПеретворення в десяткову систему числення:");
  const decimalValues = [];
  for (let i = 0; i < list.size; i++) {
    const hex = list.get(i);
    const dec = hexToDecimal(hex);
    decimalValues.push(dec);
    console.log("  " + hex + " (16) -> " + dec + " (10)");
  }

  console.log("\nФормування стеку (prev + curr + next):");
  const stack = new LinkedStack();

  for (let i = 0; i < decimalValues.length; i++) {
    const prev = i > 0 ? decimalValues[i - 1] : 0;
    const curr = decimalValues[i];
    const next = i < decimalValues.length - 1 ? decimalValues[i + 1] : 0;
    const sum = prev + curr + next;
    console.log("  i=" + i + ": " + prev + " + " + curr + " + " + next + " = " + sum);
    stack.push(sum);
  }

  console.log("\nСписок після формування стеку:");
  list.print();

  console.log("\nСформований стек:");
  stack.print();
}

main();

module.exports = { hexToDecimal };
