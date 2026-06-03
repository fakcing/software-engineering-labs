import java.util.HashMap;
import java.util.Map;

public class lab_06 {
    public static void main(String[] args) {
        // Основна карта: студент -> карта дисциплін та оцінок
        HashMap<String, HashMap<String, Integer>> journal = new HashMap<>();

        HashMap<String, Integer> student1 = new HashMap<>();
        student1.put("Математика", 95);
        student1.put("Фізика", 88);
        student1.put("Програмування", 92);
        journal.put("Іваненко Іван", student1);

        HashMap<String, Integer> student2 = new HashMap<>();
        student2.put("Математика", 75);
        student2.put("Фізика", 82);
        student2.put("Програмування", 79);
        journal.put("Петренко Олег", student2);

        HashMap<String, Integer> student3 = new HashMap<>();
        student3.put("Математика", 91);
        student3.put("Фізика", 94);
        student3.put("Програмування", 89);
        journal.put("Сидоренко Анна", student3);

        HashMap<String, Integer> student4 = new HashMap<>();
        student4.put("Математика", 60);
        student4.put("Фізика", 70);
        student4.put("Програмування", 65);
        journal.put("Коваленко Максим", student4);

        // Інший HashMap для студентів із середнім балом нижче 90
        HashMap<String, Double> studentsBelow90 = new HashMap<>();

        System.out.println("Журнал успішності студентів");
        System.out.println("---------------------------");

        for (Map.Entry<String, HashMap<String, Integer>> studentEntry : journal.entrySet()) {
            String studentName = studentEntry.getKey();
            HashMap<String, Integer> grades = studentEntry.getValue();

            int sum = 0;

            System.out.println("Студент: " + studentName);

            for (Map.Entry<String, Integer> gradeEntry : grades.entrySet()) {
                System.out.println(gradeEntry.getKey() + ": " + gradeEntry.getValue());
                sum += gradeEntry.getValue();
            }

            double average = (double) sum / grades.size();
            System.out.printf("Середній бал: %.2f%n", average);
            System.out.println();

            if (average < 90) {
                studentsBelow90.put(studentName, average);
            }
        }

        System.out.println("Студенти, чий середній бал нижче 90");
        System.out.println("-----------------------------------");

        for (Map.Entry<String, Double> entry : studentsBelow90.entrySet()) {
            System.out.printf("%s — середній бал: %.2f%n", entry.getKey(), entry.getValue());
        }
    }
}
