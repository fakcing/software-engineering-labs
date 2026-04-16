using PFMS.Enums;

namespace PFMS.Models;

/// <summary>
/// Модель працівника компанії.
/// Центральна сутність системи PFMS — відповідає класу Employee з діаграми класів (Лаб. №1).
/// </summary>
public class Employee
{
    /// <summary>Унікальний ідентифікатор працівника (генерується автоматично).</summary>
    public int Id { get; set; }

    /// <summary>Ім'я працівника.</summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>Прізвище працівника.</summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>По батькові працівника.</summary>
    public string MiddleName { get; set; } = string.Empty;

    /// <summary>Дата народження.</summary>
    public DateOnly BirthDate { get; set; }

    /// <summary>Дата прийому на роботу.</summary>
    public DateOnly HireDate { get; set; }

    /// <summary>Поточний статус (відповідає станам діаграми State Machine).</summary>
    public EmployeeStatus Status { get; set; } = EmployeeStatus.New;

    /// <summary>Ідентифікатор відділу, до якого належить працівник.</summary>
    public int DepartmentId { get; set; }

    /// <summary>Ідентифікатор посади працівника.</summary>
    public int PositionId { get; set; }

    // ── Методи ────────────────────────────────────────────────────────────

    /// <summary>
    /// Повертає повне ім'я (ПІБ) у форматі «Прізвище Ім'я По-батькові».
    /// </summary>
    public string GetFullName() => $"{LastName} {FirstName} {MiddleName}".Trim()

    /// <summary>
    /// Перевіряє, чи активний працівник.
    /// </summary>
    public bool IsActive() => Status == EmployeeStatus.Active;

    /// <summary>
    /// Переводить працівника в статус Terminated.
    /// Якщо статус вже є Terminated або Archived — генерує виняток (незворотні стани).
    /// </summary>
    /// <exception cref="InvalidOperationException">Спроба звільнити вже звільненого або архівованого.</exception>
    public void Terminate()
    {
        if (Status is EmployeeStatus.Terminated or EmployeeStatus.Archived)
            throw new InvalidOperationException(
                $"Неможливо звільнити працівника зі статусом '{Status}'.");

        Status = EmployeeStatus.Terminated;
    }

    /// <summary>
    /// Повертає рядкове представлення для відображення у списках.
    /// </summary>
    public override string ToString() =>
        $"[{Id:D4}] {GetFullName()} | Статус: {Status} | Прийнято: {HireDate}";
}
