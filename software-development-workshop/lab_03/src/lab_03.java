import java.util.*;

public class lab_03 {

    static class Flower {
        private int    id;
        private String name;
        private String type;
        private String kind;
        private String subtype;
        private double price;
        private int    quantity;

        public Flower(int id, String name, String type, String kind,
                      String subtype, double price, int quantity) {
            setId(id); setName(name); setType(type); setKind(kind);
            setSubtype(subtype); setPrice(price); setQuantity(quantity);
        }

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

    static void printTable(Flower[] flowers, String title) {
        if (flowers == null || flowers.length == 0) {
            System.out.println("  [Результат порожній — даних не знайдено]");
            return;
        }
        String sep = "-".repeat(112);
        System.out.println("\n  " + title);
        System.out.println("  " + sep);
        System.out.printf("  %-4s | %-20s | %-10s | %-22s | %-22s | %8s | %6s%n",
            "ID", "Найменування", "Тип", "Вид", "Підвид", "Ціна,грн", "К-сть");
        System.out.println("  " + sep);
        for (Flower f : flowers) {
            System.out.printf("  %-4d | %-20s | %-10s | %-22s | %-22s | %8.2f | %6d%n",
                f.getId(), f.getName(), f.getType(), f.getKind(),
                f.getSubtype(), f.getPrice(), f.getQuantity());
        }
        System.out.println("  " + sep);
        System.out.println("  Всього записів: " + flowers.length);
    }

    static void task1IndoorFlowering(Flower[] flowers) {
        System.out.println("\n  === Завдання 1: Кімнатні квітучі рослини ===");

        List<Flower> result = new ArrayList<>();
        for (Flower f : flowers) {
            if ("Кімнатна".equals(f.getType()) && "Квітуча".equals(f.getKind())) {
                result.add(f);
            }
        }

        if (result.isEmpty()) {
            System.out.println("  Кімнатних квітучих рослин у каталозі не знайдено.");
            return;
        }

        String sep = "-".repeat(62);
        System.out.println("  Кімнатні рослини що цвітуть та їх ціни:");
        System.out.println("  " + sep);
        System.out.printf("  %-4s | %-20s | %-20s | %8s%n",
            "ID", "Найменування", "Підвид", "Ціна,грн");
        System.out.println("  " + sep);

        double total = 0;
        for (Flower f : result) {
            System.out.printf("  %-4d | %-20s | %-20s | %8.2f%n",
                f.getId(), f.getName(), f.getSubtype(), f.getPrice());
            total += f.getPrice();
        }
        System.out.println("  " + sep);
        System.out.printf("  Середня ціна: %.2f грн  |  Знайдено: %d позицій%n",
            total / result.size(), result.size());
    }

    static void task2SubtypesByName(Flower[] flowers, Scanner scanner) {
        System.out.println("\n  === Завдання 2: Підвиди заданої квітки ===");

        Set<String> names = new LinkedHashSet<>();
        for (Flower f : flowers) names.add(f.getName());
        System.out.println("  Наявні квітки: " + names);

        String searchName;
        while (true) {
            System.out.print("  Введіть найменування квітки: ");
            try {
                searchName = scanner.nextLine().trim();
                if (searchName.isEmpty()) throw new IllegalArgumentException(
                    "Пошуковий запит не може бути порожнім");
                break;
            } catch (IllegalArgumentException e) {
                System.out.println("  [Помилка] " + e.getMessage());
            } catch (NoSuchElementException e) {
                System.out.println("  [Помилка] Потік введення закрито.");
                return;
            }
        }

        List<Flower> found = new ArrayList<>();
        for (Flower f : flowers) {
            if (f.getName().equalsIgnoreCase(searchName)) found.add(f);
        }

        System.out.println("\n  Підвиди квітки: \"" + searchName + "\"");
        if (found.isEmpty()) {
            System.out.println("  [Квітку з такою назвою не знайдено]");
            return;
        }

        String sep = "-".repeat(50);
        System.out.println("  " + sep);
        System.out.printf("  %-4s | %-30s | %6s%n", "ID", "Підвид", "К-сть");
        System.out.println("  " + sep);
        for (Flower f : found) {
            System.out.printf("  %-4d | %-30s | %6d%n",
                f.getId(), f.getSubtype(), f.getQuantity());
        }
        System.out.println("  " + sep);
        System.out.println("  Всього підвидів: " + found.size());
        int total = found.stream().mapToInt(Flower::getQuantity).sum();
        System.out.printf("  Загальна кількість «%s»: %d шт.%n", searchName, total);
    }

    static Flower[] generateSampleData() {
        return new Flower[] {
            new Flower(1,  "Орхідея",    "Кімнатна", "Квітуча",             "Фаленопсис",    350.00, 12),
            new Flower(2,  "Орхідея",    "Кімнатна", "Квітуча",             "Дендробіум",    420.00,  8),
            new Flower(3,  "Орхідея",    "Садова",   "Квітуча",             "Цимбідіум",     510.00,  5),
            new Flower(4,  "Фіалка",     "Кімнатна", "Квітуча",             "Сенполія",       85.00, 30),
            new Flower(5,  "Фіалка",     "Кімнатна", "Квітуча",             "Стрептокарпус", 110.00, 15),
            new Flower(6,  "Фікус",      "Кімнатна", "Декоративно-листяна", "Бенджаміна",    250.00,  7),
            new Flower(7,  "Фікус",      "Кімнатна", "Декоративно-листяна", "Каучуконосний", 320.00,  4),
            new Flower(8,  "Троянда",    "Садова",   "Квітуча",             "Чайно-гібридна",180.00, 20),
            new Flower(9,  "Троянда",    "Садова",   "Квітуча",             "Плетиста",      210.00, 10),
            new Flower(10, "Антуріум",   "Кімнатна", "Квітуча",             "Андре",         290.00,  9),
            new Flower(11, "Антуріум",   "Кімнатна", "Квітуча",             "Шерцера",       310.00,  6),
            new Flower(12, "Кактус",     "Кімнатна", "Сукулент",            "Ехінокактус",    60.00, 25),
            new Flower(13, "Кактус",     "Кімнатна", "Сукулент",            "Цереус",         75.00, 18),
            new Flower(14, "Ялина",      "Садова",   "Хвойна",              "Звичайна",      450.00,  3),
            new Flower(15, "Хризантема", "Кімнатна", "Квітуча",             "Корейська",     120.00, 22),
        };
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Лабораторна робота № 3 — Квітковий магазин, масиви об'єктів");

        Flower[] flowers = generateSampleData();
        printTable(flowers, "Каталог квіткового магазину");
        task1IndoorFlowering(flowers);
        task2SubtypesByName(flowers, scanner);

        scanner.close();
        System.out.println("\nПрограму завершено.");
    }
}
