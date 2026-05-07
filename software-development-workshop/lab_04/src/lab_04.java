import java.io.*;
import java.util.*;

public class lab_04 {
    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Робоча директорія: " + System.getProperty("user.dir"));

        System.out.print("Введіть шлях до вхідного файлу: ");
        String inputPath = scanner.nextLine().trim();

        System.out.print("Введіть шлях до вихідного файлу: ");
        String outputPath = scanner.nextLine().trim();

        File inputFile = new File(inputPath);
        if (!inputFile.exists()) {
            System.out.println("Файл не знайдено: " + inputFile.getAbsolutePath());
            return;
        }

        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(inputFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }

        System.out.println("Файл прочитано. Підраховуємо частоту букв...");

        Map<Character, Integer> frequency = new TreeMap<>();
        for (char ch : content.toString().toCharArray()) {
            if (Character.isLetter(ch)) {
                char lower = Character.toLowerCase(ch);
                frequency.put(lower, frequency.getOrDefault(lower, 0) + 1);
            }
        }

        System.out.println("\nЧастота букв:");
        for (Map.Entry<Character, Integer> entry : frequency.entrySet()) {
            System.out.println("  '" + entry.getKey() + "' -> " + entry.getValue());
        }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            writer.write("Частота букв у файлі: " + inputPath);
            writer.newLine();
            writer.write("----------------------------------");
            writer.newLine();
            for (Map.Entry<Character, Integer> entry : frequency.entrySet()) {
                writer.write("'" + entry.getKey() + "' -> " + entry.getValue());
                writer.newLine();
            }
        }

        System.out.println("\nРезультат записано у файл: " + outputPath);
        scanner.close();
    }
}
