namespace PFMS.Models;

/// <summary>
/// Особова справа працівника.
/// Є композицією з Employee (1:1) — відповідає класу PersonalFile з діаграми класів.
/// Містить усі документи, записи відпусток та оцінки ефективності.
/// </summary>
public class PersonalFile
{
    /// <summary>Унікальний номер справи у форматі PF-YYYY-NNNN (FR-002).</summary>
    public string FileNumber { get; set; } = string.Empty;

    /// <summary>Ідентифікатор власника справи (Employee.Id).</summary>
    public int EmployeeId { get; set; }

    /// <summary>Дата створення справи.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    /// <summary>Дата останнього оновлення.</summary>
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    /// <summary>Ознака архівної справи (FR-008).</summary>
    public bool IsArchived { get; set; } = false;

    /// <summary>Список документів, прикріплених до справи.</summary>
    public List<Document> Documents { get; set; } = new();

    /// <summary>Записи про відпустки / лікарняні (FR-004).</summary>
    public List<LeaveRecord> LeaveRecords { get; set; } = new();

    /// <summary>Оцінки ефективності (Performance Review).</summary>
    public List<PerformanceReview> PerformanceReviews { get; set; } = new();

    // ── Методи ────────────────────────────────────────────────────────────

    /// <summary>
    /// Архівує справу. Після архівування справу не можна редагувати (FR-008).
    /// </summary>
    /// <exception cref="InvalidOperationException">Справа вже архівована.</exception>
    public void Archive()
    {
        if (IsArchived)
            throw new InvalidOperationException(
                $"Справа {FileNumber} вже є архівованою.");

        IsArchived = true;
        UpdatedAt = DateTime.Now;
    }

    /// <summary>
    /// Додає документ до справи та оновлює дату зміни.
    /// </summary>
    /// <param name="document">Документ для додавання.</param>
    /// <exception cref="InvalidOperationException">Спроба змінити архівну справу.</exception>
    public void AddDocument(Document document)
    {
        EnsureNotArchived();
        Documents.Add(document);
        UpdatedAt = DateTime.Now;
    }

    /// <summary>
    /// Повертає короткий текстовий опис справи.
    /// </summary>
    public string GetSummary() =>
        $"Справа {FileNumber} | Документів: {Documents.Count} | " +
        $"Відпусток: {LeaveRecords.Count} | Оцінок: {PerformanceReviews.Count} | " +
        $"Архів: {(IsArchived ? "так" : "ні")}";

    // ── Приватні ──────────────────────────────────────────────────────────

    /// <summary>
    /// Перевіряє, що справа не архівована. Викидає виняток якщо так.
    /// </summary>
    private void EnsureNotArchived()
    {
        if (IsArchived)
            throw new InvalidOperationException(
                $"Справа {FileNumber} архівована і не може бути змінена.");
    }
}
