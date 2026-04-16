using PFMS.Data;
using PFMS.Enums;
using PFMS.Models;
using PFMS.Services;

namespace PFMS.UI;

/// <summary>
/// Консольний інтерфейс користувача системи PFMS.
/// Реалізує інтерактивне меню для демонстрації функціональності системи.
/// </summary>
public class ConsoleMenu
{
    private readonly AppDatabase       _db;
    private readonly EmployeeService   _employees;
    private readonly PersonalFileService _files;
    private readonly AuditService      _audit;

    // Поточний авторизований користувач (для демо — завжди HR-менеджер ID=1)
    private readonly User _currentUser;
    private const string DataPath = "data/pfms.json";

    public ConsoleMenu(AppDatabase db, EmployeeService employees,
                       PersonalFileService files, AuditService audit)
    {
        _db        = db;
        _employees = employees;
        _files     = files;
        _audit     = audit;

        // Для демонстрації: автоматично "входимо" як перший HR-менеджер
        _currentUser = _db.Users.First(u => u.Role == UserRole.HrManager);
    }

    // ── Точка входу ────────────────────────────────────────────────────────

    /// <summary>
    /// Запускає головний цикл меню. Виходить при виборі опції 0.
    /// </summary>
    public void Run()
    {
        PrintHeader();
        Console.WriteLine($"  Авторизовано як: {_currentUser.Username} ({_currentUser.Role})\n");

        bool running = true;
        while (running)
        {
            PrintMainMenu();
            var choice = ReadLine("Ваш вибір");
            Console.WriteLine();

            running = choice switch
            {
                "1" => ShowEmployeeList(),
                "2" => SearchEmployees(),
                "3" => RegisterEmployee(),
                "4" => ShowPersonalFile(),
                "5" => AddLeaveRecord(),
                "6" => AddPerformanceReview(),
                "7" => ChangeEmployeeStatus(),
                "8" => ShowAuditLog(),
                "9" => ShowDepartmentsAndPositions(),
                "0" => Exit(),
                _   => UnknownOption()
            };
        }
    }

    // ── Меню ───────────────────────────────────────────────────────────────

    private static void PrintMainMenu()
    {
        Console.WriteLine("┌─────────────────────────────────────────┐");
        Console.WriteLine("│            ГОЛОВНЕ МЕНЮ                 │");
        Console.WriteLine("├─────────────────────────────────────────┤");
        Console.WriteLine("│  1. Список працівників                  │");
        Console.WriteLine("│  2. Пошук працівників                   │");
        Console.WriteLine("│  3. Зареєструвати нового працівника     │");
        Console.WriteLine("│  4. Переглянути особову справу          │");
        Console.WriteLine("│  5. Додати запис про відпустку          │");
        Console.WriteLine("│  6. Додати оцінку ефективності          │");
        Console.WriteLine("│  7. Змінити статус працівника           │");
        Console.WriteLine("│  8. Журнал аудиту                       │");
        Console.WriteLine("│  9. Відділи та посади                   │");
        Console.WriteLine("│  0. Вийти                               │");
        Console.WriteLine("└─────────────────────────────────────────┘");
    }

    // ── Обробники опцій ────────────────────────────────────────────────────

    private bool ShowEmployeeList()
    {
        var list = _employees.GetAll().ToList();
        Console.WriteLine($"  Реєстр працівників ({list.Count} записів):\n");

        if (list.Count == 0)
        {
            Console.WriteLine("  (список порожній)");
        }
        else
        {
            foreach (var emp in list)
            {
                var dept = _employees.GetDepartmentName(emp.DepartmentId);
                var pos  = _employees.GetPositionTitle(emp.PositionId);
                Console.WriteLine($"  {emp}");
                Console.WriteLine($"       Відділ: {dept} | Посада: {pos}");
                Console.WriteLine();
            }
        }

        Pause();
        return true;
    }

    private bool SearchEmployees()
    {
        var query = ReadLine("Введіть ім'я, відділ або посаду для пошуку");
        var results = _employees.Search(query).ToList();

        Console.WriteLine($"\n  Знайдено: {results.Count} записів\n");
        foreach (var emp in results)
            Console.WriteLine($"  {emp}");

        Pause();
        return true;
    }

    private bool RegisterEmployee()
    {
        Console.WriteLine("  ─── Реєстрація нового працівника ───\n");

        var emp = new Employee
        {
            LastName   = ReadLine("Прізвище"),
            FirstName  = ReadLine("Ім'я"),
            MiddleName = ReadLine("По батькові"),
            BirthDate  = ReadDate("Дата народження (рррр-мм-дд)"),
            HireDate   = DateOnly.FromDateTime(DateTime.Today),
        };

        // Вибір відділу
        Console.WriteLine("\n  Доступні відділи:");
        foreach (var d in _db.Departments)
            Console.WriteLine($"    {d.Id}. {d}");
        emp.DepartmentId = ReadInt("ID відділу");

        // Вибір посади
        Console.WriteLine("\n  Доступні посади:");
        foreach (var p in _db.Positions)
            Console.WriteLine($"    {p.Id}. {p}");
        emp.PositionId = ReadInt("ID посади");

        try
        {
            var registered = _employees.Register(emp, _currentUser.Id);
            var file = _files.GetByEmployeeId(registered.Id);

            Console.WriteLine($"\n  ✓ Працівника успішно зареєстровано!");
            Console.WriteLine($"    ID: {registered.Id}");
            Console.WriteLine($"    ПІБ: {registered.GetFullName()}");
            Console.WriteLine($"    Номер справи: {file?.FileNumber}");

            _db.Save(DataPath);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"\n  ✗ Помилка валідації: {ex.Message}");
        }

        Pause();
        return true;
    }

    private bool ShowPersonalFile()
    {
        var id = ReadInt("ID працівника");
        var emp = _employees.GetById(id);

        if (emp is null)
        {
            Console.WriteLine("  ✗ Працівника не знайдено.");
            Pause();
            return true;
        }

        var file = _files.GetByEmployeeId(id);
        if (file is null)
        {
            Console.WriteLine("  ✗ Особову справу не знайдено.");
            Pause();
            return true;
        }

        Console.WriteLine($"\n  ═══ Особова справа {file.FileNumber} ═══");
        Console.WriteLine($"  Працівник : {emp.GetFullName()}");
        Console.WriteLine($"  Відділ    : {_employees.GetDepartmentName(emp.DepartmentId)}");
        Console.WriteLine($"  Посада    : {_employees.GetPositionTitle(emp.PositionId)}");
        Console.WriteLine($"  Статус    : {emp.Status}");
        Console.WriteLine($"  {file.GetSummary()}");

        if (file.Documents.Count > 0)
        {
            Console.WriteLine("\n  Документи:");
            foreach (var doc in file.Documents)
                Console.WriteLine($"    • {doc} | Дійсний: {(doc.Validate() ? "так" : "ні")}");
        }

        if (file.LeaveRecords.Count > 0)
        {
            Console.WriteLine("\n  Записи про відпустки:");
            foreach (var leave in file.LeaveRecords)
                Console.WriteLine($"    • {leave}");
        }

        if (file.PerformanceReviews.Count > 0)
        {
            Console.WriteLine("\n  Оцінки ефективності:");
            foreach (var review in file.PerformanceReviews)
                Console.WriteLine($"    • {review}");
        }

        Pause();
        return true;
    }

    private bool AddLeaveRecord()
    {
        var id = ReadInt("ID працівника");
        Console.WriteLine("\n  Типи відпустки: 0=Annual, 1=SickLeave, 2=Unpaid, 3=Maternity");

        var leave = new LeaveRecord
        {
            StartDate = ReadDate("Дата початку (рррр-мм-дд)"),
            EndDate   = ReadDate("Дата завершення (рррр-мм-дд)"),
            Type      = (LeaveType)ReadInt("Тип відпустки (число)"),
            Approved  = ReadLine("Схвалено? (т/н)").ToLower() == "т",
        };

        try
        {
            _files.AddLeaveRecord(id, leave, _currentUser.Id);
            Console.WriteLine($"\n  ✓ Запис про відпустку додано. Тривалість: {leave.GetDuration()} дн.");
            _db.Save(DataPath);
        }
        catch (Exception ex) { Console.WriteLine($"\n  ✗ {ex.Message}"); }

        Pause();
        return true;
    }

    private bool AddPerformanceReview()
    {
        var id = ReadInt("ID працівника");

        var review = new PerformanceReview
        {
            Period     = ReadLine("Період (напр. H1 2025)"),
            Score      = float.Parse(ReadLine("Бал (1.0–5.0)")),
            ReviewedBy = ReadLine("Рецензент (ПІБ або посада)"),
            Comments   = ReadLine("Коментар"),
        };

        try
        {
            _files.AddPerformanceReview(id, review, _currentUser.Id);
            Console.WriteLine($"\n  ✓ Оцінку додано. Оцінка: {review.GetGrade()} ({review.Score:F1})");
            _db.Save(DataPath);
        }
        catch (Exception ex) { Console.WriteLine($"\n  ✗ {ex.Message}"); }

        Pause();
        return true;
    }

    private bool ChangeEmployeeStatus()
    {
        var id = ReadInt("ID працівника");
        var emp = _employees.GetById(id);

        if (emp is null)
        {
            Console.WriteLine("  ✗ Працівника не знайдено.");
            Pause();
            return true;
        }

        Console.WriteLine($"\n  Поточний статус: {emp.Status}");
        Console.WriteLine("  Доступні переходи:");
        Console.WriteLine("    1. Відправити у відпустку   (ACTIVE → ON_LEAVE)");
        Console.WriteLine("    2. Повернути з відпустки    (ON_LEAVE → ACTIVE)");
        Console.WriteLine("    3. Відсторонити             (ACTIVE → SUSPENDED)");
        Console.WriteLine("    4. Відновити                (SUSPENDED → ACTIVE)");
        Console.WriteLine("    5. Звільнити                (→ TERMINATED → ARCHIVED)");

        var action = ReadLine("Вибір");
        try
        {
            switch (action)
            {
                case "1": _employees.SendOnLeave(id, _currentUser.Id); break;
                case "2": _employees.ReturnFromLeave(id, _currentUser.Id); break;
                case "3": _employees.Suspend(id, _currentUser.Id); break;
                case "4": _employees.Reinstate(id, _currentUser.Id); break;
                case "5": _employees.Terminate(id, _currentUser.Id); break;
                default: Console.WriteLine("  Невідома опція."); Pause(); return true;
            }
            Console.WriteLine($"\n  ✓ Статус змінено. Новий статус: {emp.Status}");
            _db.Save(DataPath);
        }
        catch (Exception ex) { Console.WriteLine($"\n  ✗ {ex.Message}"); }

        Pause();
        return true;
    }

    private bool ShowAuditLog()
    {
        Console.WriteLine("  ─── Журнал аудиту (останні 20 записів) ───\n");
        foreach (var log in _audit.GetAll().Take(20))
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == log.UserId);
            Console.WriteLine($"  {log.Format()} | Користувач: {user?.Username ?? "—"}");
        }
        Pause();
        return true;
    }

    private bool ShowDepartmentsAndPositions()
    {
        Console.WriteLine("  ─── Відділи ───");
        foreach (var d in _db.Departments)
        {
            var count = _db.Employees.Count(e => e.DepartmentId == d.Id &&
                                                  e.Status == EmployeeStatus.Active);
            Console.WriteLine($"  {d} | Активних працівників: {count}");
        }

        Console.WriteLine("\n  ─── Посади ───");
        foreach (var p in _db.Positions)
            Console.WriteLine($"  {p}");

        Pause();
        return true;
    }

    private bool Exit()
    {
        _db.Save(DataPath);
        Console.WriteLine("  Дані збережено. До побачення!\n");
        return false; // завершує головний цикл
    }

    private static bool UnknownOption()
    {
        Console.WriteLine("  Невідома опція. Спробуйте ще раз.");
        Pause();
        return true;
    }

    // ── Утиліти введення ───────────────────────────────────────────────────

    private static string ReadLine(string prompt)
    {
        Console.Write($"  {prompt}: ");
        return Console.ReadLine()?.Trim() ?? string.Empty;
    }

    private static int ReadInt(string prompt)
    {
        while (true)
        {
            var input = ReadLine(prompt);
            if (int.TryParse(input, out var result)) return result;
            Console.WriteLine("  Введіть ціле число.");
        }
    }

    private static DateOnly ReadDate(string prompt)
    {
        while (true)
        {
            var input = ReadLine(prompt);
            if (DateOnly.TryParse(input, out var result)) return result;
            Console.WriteLine("  Формат дати: рррр-мм-дд (наприклад, 2024-09-01).");
        }
    }

    private static void Pause()
    {
        Console.WriteLine("\n  Натисніть Enter для продовження...");
        Console.ReadLine();
        Console.Clear();
    }

    private static void PrintHeader()
    {
        Console.Clear();
        Console.WriteLine("╔═══════════════════════════════════════════╗");
        Console.WriteLine("║   PFMS — Personnel File Management System  ║");
        Console.WriteLine("║   Система керування особовими справами     ║");
        Console.WriteLine("╚═══════════════════════════════════════════╝\n");
    }
}
