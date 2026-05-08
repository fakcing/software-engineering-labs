import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class lab_05 {

    static class MobilePhone {
        String model;
        String brand;
        int year;
        List<Component> components = new ArrayList<>();

        MobilePhone(String brand, String model, int year) {
            this.brand = brand;
            this.model = model;
            this.year = year;
        }

        void addComponent(String name, String purpose, String properties) {
            components.add(new Component(name, purpose, properties));
        }

        Component findByName(String name) {
            for (Component c : components) {
                if (c.name.equalsIgnoreCase(name)) return c;
            }
            return null;
        }

        List<Component> findByPurpose(String purpose) {
            List<Component> result = new ArrayList<>();
            for (Component c : components) {
                if (c.purpose.toLowerCase().contains(purpose.toLowerCase())) result.add(c);
            }
            return result;
        }

        void print() {
            System.out.println("Телефон: " + brand + " " + model + " (" + year + ")");
            System.out.println("Компоненти (" + components.size() + "):");
            for (Component c : components) {
                c.print();
            }
        }

        class Component {
            String name;
            String purpose;
            String properties;

            Component(String name, String purpose, String properties) {
                this.name = name;
                this.purpose = purpose;
                this.properties = properties;
            }

            void print() {
                System.out.println("  [" + name + "] Призначення: " + purpose + " | Властивості: " + properties);
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        MobilePhone phone = new MobilePhone("Samsung", "Galaxy S24", 2024);
        phone.addComponent("Процесор",   "Обробка даних",         "Snapdragon 8 Gen 3, 8 ядер");
        phone.addComponent("Батарея",    "Живлення пристрою",     "5000 мАг, швидка зарядка");
        phone.addComponent("Камера",     "Фото та відеозйомка",   "200 МП, оптична стабілізація");
        phone.addComponent("Дисплей",    "Відображення інформації","6.8\", AMOLED, 120 Гц");
        phone.addComponent("Пам'ять",    "Зберігання даних",      "256 ГБ, RAM 12 ГБ");

        System.out.println("=== Інформація про телефон ===");
        phone.print();

        while (true) {
            System.out.println("\n=== Пошук ===");
            System.out.println("[1] Пошук компонента за назвою");
            System.out.println("[2] Пошук компонентів за призначенням");
            System.out.println("[0] Вихід");
            System.out.print("Вибір: ");
            String choice = scanner.nextLine().trim();

            if (choice.equals("0")) break;

            if (choice.equals("1")) {
                System.out.print("Введіть назву компонента: ");
                String name = scanner.nextLine().trim();
                MobilePhone.Component found = phone.findByName(name);
                if (found != null) {
                    System.out.println("Знайдено:");
                    found.print();
                } else {
                    System.out.println("Компонент \"" + name + "\" не знайдено.");
                }
            } else if (choice.equals("2")) {
                System.out.print("Введіть призначення: ");
                String purpose = scanner.nextLine().trim();
                List<MobilePhone.Component> results = phone.findByPurpose(purpose);
                if (!results.isEmpty()) {
                    System.out.println("Знайдено " + results.size() + " компонент(ів):");
                    for (MobilePhone.Component c : results) c.print();
                } else {
                    System.out.println("Нічого не знайдено.");
                }
            } else {
                System.out.println("Невірний вибір.");
            }
        }

        System.out.println("Завершення програми.");
        scanner.close();
    }
}
