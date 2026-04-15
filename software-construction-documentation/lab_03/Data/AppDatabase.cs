using System.Text.Json;
using PFMS.Models;

namespace PFMS.Data;

/// <summary>
/// Клас бази даних застосунку — зберігає всі колекції в пам'яті
/// та забезпечує збереження/завантаження даних у форматі JSON.
/// Реалізує патерн «Сховище даних» (Repository Pattern) на рівні зберігання.
/// </summary>
public class AppDatabase
{
    // ── Колекції даних ────────────────────────────────────────────────────

    /// <summary>Реєстр усіх працівників.</summary>
    public List<Employee> Employees { get; set; } = new();

    /// <summary>Особові справи (1:1 з Employee).</summary>
    public List<PersonalFile> PersonalFiles { get; set; } = new();

    /// <summary>Відділи компанії.</summary>
    public List<Department> Departments { get; set; } = new();

    /// <summary>Посади.</summary>
    public List<Position> Positions { get; set; } = new();

    /// <summary>Користувачі системи.</summary>
    public List<User> Users { get; set; } = new();

    /// <summary>Журнал аудиту всіх дій (FR-006).</summary>
    public List<AuditLog> AuditLogs { get; set; } = new();

    // ── Лічильники для генерації ID ───────────────────────────────────────
    public int NextEmployeeId  { get; set; } = 1;
    public int NextFileSeq     { get; set; } = 1;
    public int NextDocumentId  { get; set; } = 1;
    public int NextLeaveId     { get; set; } = 1;
    public int NextReviewId    { get; set; } = 1;
    public int NextAuditId     { get; set; } = 1;

    // ── JSON-серіалізація ─────────────────────────────────────────────────

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented    = true,
        // Дозволяє коректну серіалізацію поліморфних типів Document
        PropertyNameCaseInsensitive = true
    };

    /// <summary>
    /// Зберігає стан бази даних у файл JSON за вказаним шляхом.
    /// </summary>
    /// <param name="path">Шлях до файлу (наприклад, «data/pfms.json»).</param>
    public void Save(string path)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(path) ?? ".");
        var json = JsonSerializer.Serialize(this, _jsonOptions);
        File.WriteAllText(path, json);
    }

    /// <summary>
    /// Завантажує базу даних із JSON-файлу.
    /// Якщо файл не існує — повертає нову пусту базу з демо-даними.
    /// </summary>
    /// <param name="path">Шлях до файлу.</param>
    public static AppDatabase Load(string path)
    {
        if (!File.Exists(path))
            return CreateWithSeedData();

        try
        {
            var json = File.ReadAllText(path);
            return JsonSerializer.Deserialize<AppDatabase>(json, _jsonOptions)
                   ?? CreateWithSeedData();
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"[ПОПЕРЕДЖЕННЯ] Не вдалося завантажити дані: {ex.Message}");
            Console.WriteLine("Використовуються демонстраційні дані.");
            return CreateWithSeedData();
        }
    }

    // ── Початкові (seed) дані ─────────────────────────────────────────────

    /// <summary>
    /// Створює базу даних із демонстраційними даними для тестування.
    /// Відтворює сценарії з діаграм об'єктів Лабораторної роботи №1.
    /// </summary>
    private static AppDatabase CreateWithSeedData()
    {
        var db = new AppDatabase();

        // Відділи
        db.Departments.AddRange(new[]
        {
            new Department { Id = 1, Name = "Відділ інформаційних технологій", Code = "IT-05" },
            new Department { Id = 2, Name = "Юридичний відділ",               Code = "LGL-03" },
            new Department { Id = 3, Name = "Відділ кадрів",                  Code = "HR-01" },
        });

        // Посади
        db.Positions.AddRange(new[]
        {
            new Position { Id = 1, Title = "Програміст",      SalaryGrade = 8 },
            new Position { Id = 2, Title = "Старший юрист",   SalaryGrade = 11 },
            new Position { Id = 3, Title = "HR-менеджер",     SalaryGrade = 9 },
            new Position { Id = 4, Title = "Системний адміністратор", SalaryGrade = 10 },
        });

        // Користувачі
        db.Users.AddRange(new[]
        {
            new User { Id = 1, Username = "o.kovalchenko", Role = Enums.UserRole.HrManager,
                       Email = "kovalchenko@pfms.ua" },
            new User { Id = 2, Username = "m.petrenko",    Role = Enums.UserRole.HrManager,
                       Email = "petrenko@pfms.ua" },
            new User { Id = 3, Username = "admin",         Role = Enums.UserRole.Administrator,
                       Email = "admin@pfms.ua" },
        });

        // Працівник #1: Шевченко Тарас (сценарій із діаграми об'єктів 5.1)
        var shevchenko = new Employee
        {
            Id           = 1,
            FirstName    = "Тарас",
            LastName     = "Шевченко",
            MiddleName   = "Григорович",
            BirthDate    = new DateOnly(1998, 3, 9),
            HireDate     = new DateOnly(2024, 9, 1),
            Status       = Enums.EmployeeStatus.Active,
            DepartmentId = 1,
            PositionId   = 1,
        };
        db.Employees.Add(shevchenko);
        db.NextEmployeeId = 2;

        // Особова справа #1
        var file1 = new PersonalFile
        {
            FileNumber   = "PF-2024-1042",
            EmployeeId   = 1,
            CreatedAt    = new DateTime(2024, 9, 1, 9, 15, 0),
            UpdatedAt    = new DateTime(2024, 9, 1, 9, 15, 0),
        };
        file1.Documents.Add(new IdentityDocument
        {
            Id = 1, Title = "Паспорт серії АА", SeriesNumber = "АА123456",
            IssuedDate = new DateOnly(2016, 5, 20),
            ExpiryDate = new DateOnly(2030, 5, 20),
            FilePath   = "docs/passport_1042.pdf"
        });
        file1.Documents.Add(new EducationDocument
        {
            Id = 2, Title = "Диплом бакалавра КПІ",
            IssuedDate  = new DateOnly(2021, 6, 30),
            Institution = "КПІ ім. Ігоря Сікорського",
            Specialty   = "Програмна інженерія",
            FilePath    = "docs/diploma_1042.pdf"
        });
        db.PersonalFiles.Add(file1);
        db.NextFileSeq    = 1043;
        db.NextDocumentId = 3;

        // Працівник #2: Мельник Оксана (сценарій із діаграми об'єктів 5.2)
        var melnyk = new Employee
        {
            Id           = 2,
            FirstName    = "Оксана",
            LastName     = "Мельник",
            MiddleName   = "Василівна",
            BirthDate    = new DateOnly(1985, 11, 14),
            HireDate     = new DateOnly(2021, 3, 1),
            Status       = Enums.EmployeeStatus.Active,
            DepartmentId = 2,
            PositionId   = 2,
        };
        db.Employees.Add(melnyk);
        db.NextEmployeeId = 3;

        // Особова справа #2
        var file2 = new PersonalFile
        {
            FileNumber = "PF-2021-0887",
            EmployeeId = 2,
            CreatedAt  = new DateTime(2021, 3, 1, 10, 0, 0),
            UpdatedAt  = new DateTime(2024, 12, 10, 14, 32, 0),
        };
        file2.LeaveRecords.Add(new LeaveRecord
        {
            Id        = 1,
            StartDate = new DateOnly(2024, 7, 1),
            EndDate   = new DateOnly(2024, 7, 28),
            Type      = Enums.LeaveType.Annual,
            Approved  = true
        });
        file2.PerformanceReviews.Add(new PerformanceReview
        {
            Id         = 1,
            Period     = "H1 2024",
            Score      = 4.5f,
            ReviewedBy = "Іваненко В.П.",
            Comments   = "Відмінна робота. Рекомендовано для підвищення."
        });
        db.PersonalFiles.Add(file2);
        db.NextLeaveId  = 2;
        db.NextReviewId = 2;

        // Запис аудиту
        db.AuditLogs.Add(new AuditLog
        {
            Id        = 1,
            Action    = "CREATE_EMPLOYEE",
            Timestamp = new DateTime(2024, 9, 1, 9, 15, 0),
            EntityId  = 1,
            UserId    = 1
        });
        db.AuditLogs.Add(new AuditLog
        {
            Id        = 2,
            Action    = "UPDATE_FILE",
            Timestamp = new DateTime(2024, 12, 10, 14, 32, 0),
            EntityId  = 2,
            UserId    = 2
        });
        db.NextAuditId = 3;

        return db;
    }
}
