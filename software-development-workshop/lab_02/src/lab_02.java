import java.util.Random;

public class lab_02 {
    static String processNumber(String numberStr) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < numberStr.length(); i++) {
            char ch = numberStr.charAt(i);
            result.append(ch);
            int digit = ch - '0';
            if (digit % 2 == 0) {
                int doubled;
                if (digit == 2) {
                    doubled = 1;
                } else {
                    doubled = digit * 2;
                    if (doubled > 9) doubled = 0;
                }
                result.append((char) ('0' + doubled));
            }
        }
        return result.toString();
    }

    static void runTask1() {
        Random random = new Random();

        System.out.println("=".repeat(55));
        System.out.println("  ЗАВДАННЯ 1 — Варіант 17");
        System.out.println("  Парну цифру * 2, вставити праворуч (2→1, >9→0)");
        System.out.println("=".repeat(55));
        System.out.println();

        System.out.printf("  %-15s  %-25s%n", "Вхідне число", "Результат");
        System.out.println("  " + "-".repeat(42));

        for (int i = 0; i < 10; i++) {
            int number = 10000 + random.nextInt(90000);
            String input = String.valueOf(number);
            String output = processNumber(input);
            System.out.printf("  %-15s  %-25s%n", input, output);
        }

        System.out.println();
        System.out.println("  --- Тестові приклади ---");
        String[] tests = {"64583", "22222", "99999", "12345", "80604"};
        for (String t : tests) {
            System.out.printf("  %-10s  ->  %s%n", t, processNumber(t));
        }

        System.out.println();
        System.out.println("  --- Покроковий розбір: 64583 ---");
        String demo = "64583";
        StringBuilder step = new StringBuilder();
        for (int i = 0; i < demo.length(); i++) {
            int d = demo.charAt(i) - '0';
            step.append(d);
            if (d % 2 == 0) {
                int dbl = (d == 2) ? 1 : (d * 2 > 9 ? 0 : d * 2);
                System.out.printf("    Цифра %d — парна   -> вставляємо %d праворуч%n", d, dbl);
                step.append(dbl);
            } else {
                System.out.printf("    Цифра %d — непарна -> без змін%n", d);
            }
        }
        System.out.println("  Результат: " + step);
        System.out.println();
    }

    static String removeNonLetters(String text) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            if (Character.isLetter(ch) || ch == ' ' || ch == '\n' || ch == '\t') {
                result.append(ch);
            }
        }
        return result.toString();
    }

    static void runTask2() {
        String text =
            "Університет засновано у 1933 році.\n" +
            "Адреса: вул. Космонавта Комарова, 1, Київ, 03058.\n" +
            "Телефон: +38 (044) 406-74-20; факс: 406-74-21.\n" +
            "Сайт: https://nau.edu.ua -- офіційний ресурс!\n" +
            "Кількість студентів: ~25,000 осіб (2024 рік).\n" +
            "P.S. Ласкаво просимо! Навчайтесь на \"відмінно\" :-)";

        System.out.println("=".repeat(60));
        System.out.println("  ЗАВДАННЯ 2 — Варіант 17");
        System.out.println("  Видалити всі символи окрім пробілів, які не є буквами");
        System.out.println("=".repeat(60));

        System.out.println("\n  ТЕКСТ ДО ОБРОБКИ:");
        System.out.println("  " + "-".repeat(58));
        for (String line : text.split("\n")) {
            System.out.println("  " + line);
        }

        String result = removeNonLetters(text);

        System.out.println("\n  ТЕКСТ ПІСЛЯ ОБРОБКИ:");
        System.out.println("  " + "-".repeat(58));
        for (String line : result.split("\n")) {
            System.out.println("  " + line);
        }

        long removedCount = text.chars()
                .filter(ch -> !Character.isLetter(ch) && ch != ' ' && ch != '\n' && ch != '\t')
                .count();

        System.out.println("\n  СТАТИСТИКА:");
        System.out.println("  " + "-".repeat(58));
        System.out.printf("  Символів до обробки:  %d%n", text.length());
        System.out.printf("  Символів після:        %d%n", result.length());
        System.out.printf("  Видалено символів:     %d%n", removedCount);

        System.out.print("  Видалені символи (унік.): ");
        text.chars()
                .distinct()
                .filter(ch -> !Character.isLetter(ch) && ch != ' ' && ch != '\n' && ch != '\t')
                .forEach(ch -> System.out.print("'" + (char) ch + "' "));
        System.out.println();
        System.out.println("=".repeat(60));
    }

    public static void main(String[] args) {
        runTask1();
        runTask2();
    }
}
