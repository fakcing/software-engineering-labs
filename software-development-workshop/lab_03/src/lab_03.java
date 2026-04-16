import java.util.*;

/**
 * Лабораторна робота № 3
 * Робота з масивами об'єктів класів. Обробка виключень у Java.
 *
 * Опис даних: Квітковий магазин
 * Поля: Ідентифікаційний номер, Найменування, Тип, Вид, Підвид, Ціна, Кількість
 *
 * Завдання:
 *   1. Отримати список кімнатних рослин, що цвітуть, та їх ціну.
 *   2. Отримати список всіх підвидів заданої квітки та їх кількість.
 */
public class lab_03 {

    // ─── Клас Квітка ─────────────────────────────────────────────────────────
    static class Flower {
        private int    id;
        private String name;      // Найменування
        private String type;      // Тип       (Кімнатна / Садова / Польова)
        private String kind;      // Вид       (Квітуча / Декоративно-листяна / Хвойна)
        private String subtype;   // Підвид
        private double price;     // Ціна (грн)
        private int    quantity;  // Кількість (шт)

        // Конструктор
        public Flower(int id, String name, String type, String kind,
                      String subtype, double price, int quantity) {
            setId(id);
            setName(name);
            setType(type);
            setKind(kind);
            setSubtype(subtype);
            setPrice(price);
            setQuantity(quantity);
        }

        // ─── Сеттери з валідацією ─────────────────────────────────────────
        public void setId(int id) {
            if (id <= 0) throw new IllegalArgumentException(
                "ID має бути > 0, отримано: " + id);
            this.id = id;
        }
        public void setName(String name) {
            if (name == null || name.isBlank()) throw new IllegalArgumentException(
                "Найменування не може бути порожнім");
            this.name = name.trim();
        }
        public void setType(String type) {
            List<String> valid = Arrays.asList("Кімнатна", "Садова", "Польова");
            if (!valid.contains(type)) throw new IllegalArgumentException(
                "Тип має бути одним із: " + valid + ", отримано: \"" + type + "\"");
            this.type = type;
        }
        public void setKind(String kind) {
            List<String> valid = Arrays.asList(
                "Квітуча", "Декоративно-листяна", "Хвойна", "Сукулент", "Трав'яниста");
            if (!valid.contains(kind)) throw new IllegalArgumentException(
                "Вид має бути одним із: " + valid + ", отримано: \"" + kind + "\"");
            this.kind = kind;
        }
        public void setSubtype(String subtype) {
            if (subtype == null || subtype.isBlank()) throw new IllegalArgumentException(
                "Підвид не може бути порожнім");
            this.subtype = subtype.trim();
        }
        public void setPrice(double price) {
            if (price < 0) throw new IllegalArgumentException(
                "Ціна не може бути від'ємною, отримано: " + price);
            this.price = price;
        }
        public void setQuantity(int quantity) {
            if (quantity < 0) throw new IllegalArgumentException(
                "Кількість не може бути від'ємною, отримано: " + quantity);
            this.quantity = quantity;
        }

        // ─── Гетери ───────────────────────────────────────────────────────
        public int    getId()       { return id; }
        public String getName()     { return name; }
        public String getType()     { return type; }
        public String getKind()     { return kind; }
        public String getSubtype()  { return subtype; }
        public double getPrice()    { return price; }
        public int    getQuantity() { return quantity; }

        @Override
        public String toString() {
            return String.format("Flower{id=%d, name='%s', type='%s', kind='%s', " +
                "subtype='%s', price=%.2f, qty=%d}",
                id, name, type, kind, subtype, price, quantity);
        }
    }

    // ─── Виведення таблиці (всіх квіток) ─────────────────────────────────────
    static final String COL_RESET  = "\033[0m";
    static final String COL_HEADER = "\033[1;36m";   // cyan bold
    static final String COL_ROW1   = "\033[0;37m";   // white
    static final String COL_ROW2   = "\033[0;90m";   // gray
    static final String COL_GREEN  = "\033[0;32m";
    static final String COL_YELLOW = "\033[0;33m";
    static final String COL_RED    = "\033[0;31m";

    static void printTable(Flower[] flowers, String title) {
        if (flowers == null || flowers.length == 0) {
            System.out.println(COL_RED + "  [Результат порожній — даних не знайдено]" + COL_RESET);
            return;
        }

        String sep = "─".repeat(110);
        System.out.println(COL_HEADER + "\n  " + title);
        System.out.println("  " + sep);
        System.out.printf(COL_HEADER + "  %-4s │ %-20s │ %-10s │ %-22s │ %-22s │ %8s │ %6s%n",
            "ID", "Найменування", "Тип", "Вид", "Підвид", "Ціна,грн", "К-сть");
        System.out.println("  " + sep + COL_RESET);

        for (int i = 0; i < flowers.length; i++) {
            Flower f  = flowers[i];
            String col = (i % 2 == 0) ? COL_ROW1 : COL_ROW2;
            System.out.printf(col +
                "  %-4d │ %-20s │ %-10s │ %-22s │ %-22s │ %8.2f │ %6d%n" + COL_RESET,
                f.getId(), f.getName(), f.getType(), f.getKind(),
                f.getSubtype(), f.getPrice(), f.getQuantity());
        }

        System.out.println(COL_HEADER + "  " + sep);
        System.out.println("  Всього записів: " + flowers.length + COL_RESET);
    }

    // Виведення таблиці з підвидами + кількість
    static void printSubtypeTable(String flowerName, List<Flower> list) {
        System.out.println(COL_HEADER + "\n  Підвиди квітки: \"" + flowerName + "\"");
        if (list.isEmpty()) {
            System.out.println(COL_RED + "  [Квітку з такою назвою не знайдено]" + COL_RESET);
            return;
        }
        String sep = "─".repeat(60);
        System.out.println("  " + sep);
        System.out.printf(COL_HEADER + "  %-4s │ %-30s │ %6s%n",
            "ID", "Підвид", "К-сть");
        System.out.println("  " + sep + COL_RESET);
        for (Flower f : list) {
            System.out.printf(COL_ROW1 + "  %-4d │ %-30s │ %6d%n" + COL_RESET,
                f.getId(), f.getSubtype(), f.getQuantity());
        }
        System.out.println(COL_HEADER + "  " + sep);
        System.out.println("  Всього підвидів: " + list.size() + COL_RESET);
    }

    // ─── Задача 1: Кімнатні рослини, що цвітуть ──────────────────────────────
    static void task1IndoorFlowering(Flower[] flowers) {
        System.out.println(COL_GREEN +
            "\n  ╔══════════════════════════════════════╗" +
            "\n  ║  Завдання 1: Кімнатні квітучі рослини║" +
            "\n  ╚══════════════════════════════════════╝" + COL_RESET);

        List<Flower> result = new ArrayList<>();
        for (Flower f : flowers) {
            if ("Кімнатна".equals(f.getType()) && "Квітуча".equals(f.getKind())) {
                result.add(f);
            }
        }

        if (result.isEmpty()) {
            System.out.println(COL_RED +
                "  Кімнатних квітучих рослин у каталозі не знайдено." + COL_RESET);
            return;
        }

        // Вивід таблиці з ціною
        String sep = "─".repeat(60);
        System.out.println(COL_HEADER + "\n  Кімнатні рослини що цвітуть та їх ціни:");
        System.out.println("  " + sep);
        System.out.printf(COL_HEADER + "  %-4s │ %-20s │ %-20s │ %8s%n",
            "ID", "Найменування", "Підвид", "Ціна,грн");
        System.out.println("  " + sep + COL_RESET);

        double total = 0;
        for (int i = 0; i < result.size(); i++) {
            Flower f   = result.get(i);
            String col = (i % 2 == 0) ? COL_ROW1 : COL_ROW2;
            System.out.printf(col + "  %-4d │ %-20s │ %-20s │ %8.2f%n" + COL_RESET,
                f.getId(), f.getName(), f.getSubtype(), f.getPrice());
            total += f.getPrice();
        }
        System.out.println(COL_HEADER + "  " + sep);
        System.out.printf(COL_YELLOW + "  Середня ціна: %.2f грн  |  Знайдено: %d позицій%n" + COL_RESET,
            total / result.size(), result.size());
    }

    // ─── Задача 2: Підвиди заданої квітки ────────────────────────────────────
    static void task2SubtypesByName(Flower[] flowers, Scanner scanner) {
        System.out.println(COL_GREEN +
            "\n  ╔══════════════════════════════════════╗" +
            "\n  ║  Завдання 2: Підвиди заданої квітки  ║" +
            "\n  ╚══════════════════════════════════════╝" + COL_RESET);

        // Унікальні назви для підказки
        Set<String> names = new LinkedHashSet<>();
        for (Flower f : flowers) names.add(f.getName());
        System.out.println(COL_YELLOW + "  Наявні квітки: " + names + COL_RESET);

        String searchName;
        while (true) {
            System.out.print("  Введіть найменування квітки: ");
            try {
                searchName = scanner.nextLine().trim();
                if (searchName.isEmpty()) throw new IllegalArgumentException(
                    "Пошуковий запит не може бути порожнім");
                break;
            } catch (IllegalArgumentException e) {
                System.out.println(COL_RED + "  [Помилка] " + e.getMessage() + COL_RESET);
            } catch (NoSuchElementException e) {
                System.out.println(COL_RED + "  [Помилка] Потік введення закрито." + COL_RESET);
                return;
            }
        }

        List<Flower> found = new ArrayList<>();
        for (Flower f : flowers) {
            if (f.getName().equalsIgnoreCase(searchName)) {
                found.add(f);
            }
        }

        printSubtypeTable(searchName, found);

        if (!found.isEmpty()) {
            int total = found.stream().mapToInt(Flower::getQuantity).sum();
            System.out.printf(COL_YELLOW + "  Загальна кількість «%s»: %d шт.%n" + COL_RESET,
                searchName, total);
        }
    }

    // ─── Ініціалізація масиву: введення з клавіатури ─────────────────────────
    static Flower[] inputFlowers(Scanner scanner, int count) {
        Flower[] flowers = new Flower[count];
        System.out.println(COL_YELLOW +
            "\n  Допустимі типи:  Кімнатна | Садова | Польова" +
            "\n  Допустимі види:  Квітуча | Декоративно-листяна | Хвойна | Сукулент | Трав'яниста"
            + COL_RESET);

        for (int i = 0; i < count; i++) {
            System.out.println(COL_HEADER + "\n  ── Квітка #" + (i + 1) + " ──" + COL_RESET);
            flowers[i] = inputOneFlower(scanner, i + 1);
        }
        return flowers;
    }

    static Flower inputOneFlower(Scanner scanner, int defaultId) {
        int    id       = readInt(scanner,    "  ID [" + defaultId + "]: ", defaultId, 1, Integer.MAX_VALUE);
        String name     = readString(scanner, "  Найменування: ");
        String type     = readChoice(scanner, "  Тип (Кімнатна/Садова/Польова): ",
                            Arrays.asList("Кімнатна", "Садова", "Польова"));
        String kind     = readChoice(scanner, "  Вид (Квітуча/Декоративно-листяна/Хвойна/Сукулент/Трав'яниста): ",
                            Arrays.asList("Квітуча", "Декоративно-листяна", "Хвойна", "Сукулент", "Трав'яниста"));
        String subtype  = readString(scanner, "  Підвид: ");
        double price    = readDouble(scanner, "  Ціна (грн): ", 0, 100_000);
        int    quantity = readInt(scanner,    "  Кількість (шт): ", -1, 0, 10_000);

        return new Flower(id, name, type, kind, subtype, price, quantity);
    }

    // ─── Генерація тестових даних ─────────────────────────────────────────────
    static Flower[] generateSampleData() {
        return new Flower[] {
            new Flower(1,  "Орхідея",      "Кімнатна", "Квітуча",               "Фаленопсис",   350.00, 12),
            new Flower(2,  "Орхідея",      "Кімнатна", "Квітуча",               "Дендробіум",   420.00,  8),
            new Flower(3,  "Орхідея",      "Садова",   "Квітуча",               "Цимбідіум",    510.00,  5),
            new Flower(4,  "Фіалка",       "Кімнатна", "Квітуча",               "Сенполія",      85.00, 30),
            new Flower(5,  "Фіалка",       "Кімнатна", "Квітуча",               "Стрептокарпус",110.00, 15),
            new Flower(6,  "Фікус",        "Кімнатна", "Декоративно-листяна",   "Бенджаміна",   250.00,  7),
            new Flower(7,  "Фікус",        "Кімнатна", "Декоративно-листяна",   "Каучуконосний",320.00,  4),
            new Flower(8,  "Троянда",      "Садова",   "Квітуча",               "Чайно-гібридна",180.00, 20),
            new Flower(9,  "Троянда",      "Садова",   "Квітуча",               "Плетиста",     210.00, 10),
            new Flower(10, "Антуріум",     "Кімнатна", "Квітуча",               "Андре",        290.00,  9),
            new Flower(11, "Антуріум",     "Кімнатна", "Квітуча",               "Шерцера",      310.00,  6),
            new Flower(12, "Кактус",       "Кімнатна", "Сукулент",              "Ехінокактус",   60.00, 25),
            new Flower(13, "Кактус",       "Кімнатна", "Сукулент",              "Цереус",        75.00, 18),
            new Flower(14, "Ялина",        "Садова",   "Хвойна",                "Звичайна",     450.00,  3),
            new Flower(15, "Хризантема",   "Кімнатна", "Квітуча",               "Корейська",    120.00, 22),
        };
    }

    // ─── Допоміжні методи введення з валідацією ──────────────────────────────
    static int readInt(Scanner sc, String prompt, int defaultVal, int min, int max) {
        while (true) {
            System.out.print(prompt);
            try {
                String line = sc.nextLine().trim();
                if (line.isEmpty() && defaultVal >= 0) return defaultVal;
                int val = Integer.parseInt(line);
                if (val < min || val > max) throw new IllegalArgumentException(
                    "Значення має бути в діапазоні [" + min + ", " + max + "]");
                return val;
            } catch (NumberFormatException e) {
                System.out.println(COL_RED + "  [Помилка введення] Очікується ціле число." + COL_RESET);
            } catch (IllegalArgumentException e) {
                System.out.println(COL_RED + "  [Помилка] " + e.getMessage() + COL_RESET);
            }
        }
    }

    static double readDouble(Scanner sc, String prompt, double min, double max) {
        while (true) {
            System.out.print(prompt);
            try {
                String line = sc.nextLine().trim().replace(",", ".");
                double val  = Double.parseDouble(line);
                if (Double.isNaN(val) || Double.isInfinite(val))
                    throw new ArithmeticException("Значення NaN або Infinity неприпустиме");
                if (val < min || val > max) throw new IllegalArgumentException(
                    "Значення має бути в діапазоні [" + min + ", " + max + "]");
                return val;
            } catch (NumberFormatException e) {
                System.out.println(COL_RED + "  [Помилка введення] Очікується число (наприклад 99.50)." + COL_RESET);
            } catch (IllegalArgumentException | ArithmeticException e) {
                System.out.println(COL_RED + "  [Помилка] " + e.getMessage() + COL_RESET);
            }
        }
    }

    static String readString(Scanner sc, String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                String val = sc.nextLine().trim();
                if (val.isEmpty()) throw new IllegalArgumentException("Значення не може бути порожнім");
                return val;
            } catch (IllegalArgumentException e) {
                System.out.println(COL_RED + "  [Помилка] " + e.getMessage() + COL_RESET);
            }
        }
    }

    static String readChoice(Scanner sc, String prompt, List<String> choices) {
        while (true) {
            System.out.print(prompt);
            try {
                String val = sc.nextLine().trim();
                for (String c : choices) {
                    if (c.equalsIgnoreCase(val)) return c;
                }
                throw new IllegalArgumentException(
                    "Дозволені значення: " + choices);
            } catch (IllegalArgumentException e) {
                System.out.println(COL_RED + "  [Помилка] " + e.getMessage() + COL_RESET);
            }
        }
    }

    // ─── ГОЛОВНИЙ МЕТОД ───────────────────────────────────────────────────────
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println(COL_HEADER +
            "╔══════════════════════════════════════════════════════╗\n" +
            "║        Лабораторна робота № 3 · Java                 ║\n" +
            "║        Квітковий магазин · Масиви об'єктів           ║\n" +
            "╚══════════════════════════════════════════════════════╝"
            + COL_RESET);

        Flower[] flowers;

        System.out.println(COL_YELLOW +
            "\n  Оберіть режим введення даних:" +
            "\n  [1] Автоматично (тестові дані — 15 квіток)" +
            "\n  [2] Вручну з клавіатури" + COL_RESET);
        System.out.print("  Ваш вибір [1]: ");

        try {
            String choice = scanner.nextLine().trim();

            if ("2".equals(choice)) {
                int count = readInt(scanner, "\n  Кількість квіток (мін. 5): ", 5, 5, 100);
                flowers   = inputFlowers(scanner, count);
            } else {
                System.out.println(COL_GREEN + "  → Завантажено тестові дані." + COL_RESET);
                flowers = generateSampleData();
            }

        } catch (Exception e) {
            System.out.println(COL_RED + "  [Критична помилка] " + e.getMessage() +
                "\n  Завантажуємо тестові дані." + COL_RESET);
            flowers = generateSampleData();
        }

        // ── Вивід всіх даних ────────────────────────────────────────────────
        printTable(flowers, "Каталог квіткового магазину");

        // ── Меню завдань ─────────────────────────────────────────────────────
        boolean running = true;
        while (running) {
            System.out.println(COL_YELLOW +
                "\n  ┌─────────────────────────────┐" +
                "\n  │  Оберіть завдання:          │" +
                "\n  │  [1] Кімнатні квітучі рослини│" +
                "\n  │  [2] Підвиди квітки         │" +
                "\n  │  [3] Весь каталог           │" +
                "\n  │  [0] Вихід                  │" +
                "\n  └─────────────────────────────┘" + COL_RESET);
            System.out.print("  Вибір: ");

            try {
                String input = scanner.nextLine().trim();
                switch (input) {
                    case "1" -> task1IndoorFlowering(flowers);
                    case "2" -> task2SubtypesByName(flowers, scanner);
                    case "3" -> printTable(flowers, "Повний каталог");
                    case "0" -> running = false;
                    default  -> System.out.println(
                        COL_RED + "  [Помилка] Введіть 0, 1, 2 або 3." + COL_RESET);
                }
            } catch (NoSuchElementException e) {
                System.out.println(COL_RED + "  [Помилка вводу] " + e.getMessage() + COL_RESET);
            } catch (Exception e) {
                System.out.println(COL_RED + "  [Непередбачена помилка] " + e.getClass().getSimpleName()
                    + ": " + e.getMessage() + COL_RESET);
            }
        }

        scanner.close();
        System.out.println(COL_GREEN + "\n  Програму завершено. До побачення!\n" + COL_RESET);
    }
}
