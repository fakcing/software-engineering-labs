using PFMS.Enums;

namespace PFMS.Models;

// ═════════════════════════════════════════════════════════════════════════════
// Department — Відділ
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Відділ компанії. Відповідає класу Department з діаграми класів (Лаб. №1).
/// </summary>
public class Department
{
    /// <summary>Унікальний ідентифікатор відділу.</summary>
    public int Id { get; set; }

    /// <summary>Повна назва відділу.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Скорочений код відділу (наприклад, «IT-05», «LGL-03»).</summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>Ідентифікатор керівника відділу (Employee.Id), може бути null.</summary>
    public int? HeadEmployeeId { get; set; }

    /// <inheritdoc/>
    public override string ToString() => $"[{Code}] {Name}";
}

// ═════════════════════════════════════════════════════════════════════════════
// Position — Посада
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Посада в компанії. Відповідає класу Position з діаграми класів (Лаб. №1).
/// </summary>
public class Position
{
    /// <summary>Унікальний ідентифікатор посади.</summary>
    public int Id { get; set; }

    /// <summary>Назва посади (наприклад, «Програміст», «Старший юрист»).</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Тарифний розряд (грейд) для розрахунку зарплати.</summary>
    public int SalaryGrade { get; set; }

    /// <summary>
    /// Повертає категорію посади на основі тарифного розряду.
    /// Розряди 1–5 — молодший персонал, 6–9 — середній, 10+ — старший.
    /// </summary>
    public string GetCategory() => SalaryGrade switch
    {
        <= 5  => "Молодший персонал",
        <= 9  => "Середній персонал",
        _     => "Старший персонал"
    };

    /// <inheritdoc/>
    public override string ToString() => $"{Title} (розряд {SalaryGrade}, {GetCategory()})";
}

// ═════════════════════════════════════════════════════════════════════════════
// LeaveRecord — Запис про відпустку
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Запис про відпустку або лікарняний працівника (FR-004).
/// Відповідає класу LeaveRecord з діаграми класів.
/// </summary>
public class LeaveRecord
{
    /// <summary>Унікальний ідентифікатор запису.</summary>
    public int Id { get; set; }

    /// <summary>Дата початку відпустки.</summary>
    public DateOnly StartDate { get; set; }

    /// <summary>Дата завершення відпустки.</summary>
    public DateOnly EndDate { get; set; }

    /// <summary>Тип відсутності.</summary>
    public LeaveType Type { get; set; }

    /// <summary>Ознака схвалення заявки керівником.</summary>
    public bool Approved { get; set; } = false;

    /// <summary>
    /// Повертає тривалість відпустки в календарних днях (включно з крайніми датами).
    /// </summary>
    public int GetDuration() => EndDate.DayNumber - StartDate.DayNumber + 1;

    /// <summary>Перевіряє, чи схвалена відпустка.</summary>
    public bool IsApproved() => Approved;

    /// <inheritdoc/>
    public override string ToString() =>
        $"{Type} | {StartDate} – {EndDate} ({GetDuration()} дн.) | " +
        $"Схвалено: {(Approved ? "так" : "ні")}";
}

// ═════════════════════════════════════════════════════════════════════════════
// PerformanceReview — Оцінка ефективності
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Результат оцінки ефективності роботи (Performance Review).
/// Відповідає класу PerformanceReview з діаграми класів.
/// </summary>
public class PerformanceReview
{
    /// <summary>Унікальний ідентифікатор оцінки.</summary>
    public int Id { get; set; }

    /// <summary>Позначення оціночного періоду (наприклад, «H1 2024», «Q3 2023»).</summary>
    public string Period { get; set; } = string.Empty;

    /// <summary>Числова оцінка в діапазоні від 1.0 до 5.0.</summary>
    public float Score { get; set; }

    /// <summary>ПІБ або посада рецензента.</summary>
    public string ReviewedBy { get; set; } = string.Empty;

    /// <summary>Коментар рецензента.</summary>
    public string Comments { get; set; } = string.Empty;

    /// <summary>
    /// Повертає літерну оцінку на основі числового балу:
    /// 4.5–5.0 → «Відмінно», 3.5–4.4 → «Добре», 2.5–3.4 → «Задовільно», менше → «Незадовільно».
    /// </summary>
    public string GetGrade() => Score switch
    {
        >= 4.5f => "Відмінно",
        >= 3.5f => "Добре",
        >= 2.5f => "Задовільно",
        _       => "Незадовільно"
    };

    /// <summary>Перевіряє, чи є оцінка позитивною (Score >= 2.5).</summary>
    public bool IsPassing() => Score >= 2.5f;

    /// <inheritdoc/>
    public override string ToString() =>
        $"Період: {Period} | Бал: {Score:F1} ({GetGrade()}) | Рецензент: {ReviewedBy}";
}

// ═════════════════════════════════════════════════════════════════════════════
// User — Користувач системи
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Користувач системи PFMS (HR-менеджер, Директор, Адміністратор).
/// Відповідає класу User з діаграми класів. Реалізує RBAC (нефункц. вимога «Безпека»).
/// </summary>
public class User
{
    /// <summary>Унікальний ідентифікатор користувача.</summary>
    public int Id { get; set; }

    /// <summary>Обліковий запис (логін).</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Роль користувача в системі.</summary>
    public UserRole Role { get; set; }

    /// <summary>Адреса електронної пошти.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Перевіряє, чи має користувач дозвіл виконувати задану операцію.
    /// Реалізує RBAC-логіку: Адміністратор має всі права,
    /// HrManager — права на управління справами, Director — лише читання.
    /// </summary>
    /// <param name="permission">Назва дозволу: "read", "write", "delete", "manage_users".</param>
    public bool HasPermission(string permission) => permission switch
    {
        "manage_users" => Role == UserRole.Administrator,
        "delete"       => Role is UserRole.Administrator or UserRole.HrManager,
        "write"        => Role is UserRole.Administrator or UserRole.HrManager,
        "read"         => true, // усі ролі мають право читати
        _              => false
    };

    /// <inheritdoc/>
    public override string ToString() => $"{Username} ({Role}) <{Email}>";
}

// ═════════════════════════════════════════════════════════════════════════════
// AuditLog — Запис журналу аудиту
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Запис журналу аудиту. Фіксує кожну дію користувача з даними (FR-006).
/// Відповідає класу AuditLog з діаграми класів.
/// </summary>
public class AuditLog
{
    /// <summary>Ідентифікатор запису.</summary>
    public int Id { get; set; }

    /// <summary>Опис виконаної дії (наприклад, «CREATE_EMPLOYEE», «UPDATE_FILE»).</summary>
    public string Action { get; set; } = string.Empty;

    /// <summary>Час виконання дії (UTC).</summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>Ідентифікатор сутності, з якою виконувалась дія.</summary>
    public int EntityId { get; set; }

    /// <summary>Ідентифікатор користувача, що виконав дію.</summary>
    public int UserId { get; set; }

    /// <summary>
    /// Форматує запис аудиту у зручний для відображення рядок.
    /// </summary>
    public string Format() =>
        $"[{Timestamp:yyyy-MM-dd HH:mm:ss}] [{Action}] EntityId={EntityId} UserId={UserId}";

    /// <inheritdoc/>
    public override string ToString() => Format();
}
