using PFMS.Data;
using PFMS.Models;

namespace PFMS.Services;

// ═════════════════════════════════════════════════════════════════════════════
// PersonalFileService — Document Module + Leave Module + Review Module
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Сервіс управління особовими справами.
/// Об'єднує функціональність Document Module, Leave Module та Review Module
/// відповідно до опису модулів Лабораторної роботи №1 (Таблиця 3.1).
/// </summary>
public class PersonalFileService
{
    private readonly AppDatabase _db;
    private readonly AuditService _audit;

    public PersonalFileService(AppDatabase db, AuditService audit)
    {
        _db    = db;
        _audit = audit;
    }

    // ── Особова справа ─────────────────────────────────────────────────────

    /// <summary>
    /// Повертає особову справу за ID працівника.
    /// </summary>
    public PersonalFile? GetByEmployeeId(int employeeId) =>
        _db.PersonalFiles.FirstOrDefault(f => f.EmployeeId == employeeId);

    // ── Документи (Document Module, FR-003) ───────────────────────────────

    /// <summary>
    /// Додає документ до особової справи працівника (FR-003).
    /// </summary>
    /// <param name="employeeId">ID працівника-власника справи.</param>
    /// <param name="document">Документ для додавання.</param>
    /// <param name="currentUserId">ID користувача, що виконує операцію.</param>
    /// <exception cref="KeyNotFoundException">Справу не знайдено.</exception>
    public void AddDocument(int employeeId, Document document, int currentUserId)
    {
        var file = GetFileOrThrow(employeeId);

        // Присвоюємо унікальний ID документу
        document.Id = _db.NextDocumentId++;

        file.AddDocument(document);  // PersonalFile.AddDocument() перевіряє архівний стан

        _audit.Log("ADD_DOCUMENT", employeeId, currentUserId);
    }

    // ── Відпустки (Leave Module, FR-004) ───────────────────────────────────

    /// <summary>
    /// Додає запис про відпустку до особової справи (FR-004).
    /// </summary>
    public void AddLeaveRecord(int employeeId, LeaveRecord leave, int currentUserId)
    {
        var file = GetFileOrThrow(employeeId);

        // Перевірка: дата закінчення не раніша за дату початку
        if (leave.EndDate < leave.StartDate)
            throw new ArgumentException("Дата закінчення відпустки не може бути раніша за дату початку.");

        leave.Id = _db.NextLeaveId++;
        file.LeaveRecords.Add(leave);
        file.UpdatedAt = DateTime.Now;

        _audit.Log("ADD_LEAVE_RECORD", employeeId, currentUserId);
    }

    // ── Оцінки ефективності (Review Module) ────────────────────────────────

    /// <summary>
    /// Додає результат оцінки ефективності до особової справи.
    /// </summary>
    public void AddPerformanceReview(int employeeId, PerformanceReview review, int currentUserId)
    {
        var file = GetFileOrThrow(employeeId);

        if (review.Score is < 1.0f or > 5.0f)
            throw new ArgumentException("Бал оцінки повинен бути від 1.0 до 5.0.");

        review.Id = _db.NextReviewId++;
        file.PerformanceReviews.Add(review);
        file.UpdatedAt = DateTime.Now;

        _audit.Log("ADD_PERFORMANCE_REVIEW", employeeId, currentUserId);
    }

    // ── Допоміжні ──────────────────────────────────────────────────────────

    /// <summary>
    /// Повертає особову справу або кидає виняток якщо не знайдено.
    /// </summary>
    private PersonalFile GetFileOrThrow(int employeeId) =>
        GetByEmployeeId(employeeId)
        ?? throw new KeyNotFoundException(
            $"Особову справу для працівника ID={employeeId} не знайдено.");
}

// ═════════════════════════════════════════════════════════════════════════════
// AuditService — Audit Module
// ═════════════════════════════════════════════════════════════════════════════

/// <summary>
/// Сервіс журналювання дій у системі.
/// Відповідає «Audit Module» з Лаб. №1 та вимозі FR-006.
/// Всі операції запису/редагування даних обов'язково проходять через цей сервіс.
/// </summary>
public class AuditService
{
    private readonly AppDatabase _db;

    public AuditService(AppDatabase db)
    {
        _db = db;
    }

    /// <summary>
    /// Фіксує подію у журналі аудиту з поточним UTC-часом.
    /// </summary>
    /// <param name="action">Код дії (наприклад, «CREATE_EMPLOYEE»).</param>
    /// <param name="entityId">ID сутності, з якою виконувалась дія.</param>
    /// <param name="userId">ID користувача, що виконав дію.</param>
    public void Log(string action, int entityId, int userId)
    {
        _db.AuditLogs.Add(new AuditLog
        {
            Id        = _db.NextAuditId++,
            Action    = action,
            Timestamp = DateTime.UtcNow,
            EntityId  = entityId,
            UserId    = userId
        });
    }

    /// <summary>
    /// Повертає всі записи журналу у зворотному хронологічному порядку (найновіші першими).
    /// </summary>
    public IEnumerable<AuditLog> GetAll() =>
        _db.AuditLogs.OrderByDescending(l => l.Timestamp);

    /// <summary>
    /// Повертає записи журналу, пов'язані з конкретним працівником.
    /// </summary>
    public IEnumerable<AuditLog> GetByEmployee(int employeeId) =>
        _db.AuditLogs
            .Where(l => l.EntityId == employeeId)
            .OrderByDescending(l => l.Timestamp);
}
