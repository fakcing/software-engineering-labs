import java.util.Random;

public class lab_01 {
    public static void main(String[] args) {

        // створюємо матрицю 4 рядки і 3 стовпці
        int[][] B = new int[4][3];
        Random rand = new Random();

        // заповнюємо матрицю випадковими числами від -15 до 15
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 3; j++) {
                B[i][j] = rand.nextInt(31) - 15;
            }
        }

        // виводимо матрицю до обробки
        System.out.println("Матриця B до обробки:");
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 3; j++) {
                System.out.print(B[i][j] + "\t");
            }
            System.out.println();
        }

        // знаходимо суму від'ємних непарних елементів
        int sum = 0;

        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 3; j++) {
                if (B[i][j] < 0 && B[i][j] % 2 != 0) {
                    sum = sum + B[i][j];
                }
            }
        }

        // виводимо результат
        System.out.println();
        System.out.println("Сума всіх від'ємних непарних елементів: " + sum);

        System.out.println();
        System.out.println("Матриця В:");
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 3; j++) {
                System.out.print(B[i][j] + "\t");
            }
            System.out.println();
        }
    }
}