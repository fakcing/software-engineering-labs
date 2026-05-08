using PFMS.Data;
using PFMS.Models;

namespace PFMS.Services;

public class PersonalFileService
{
    private readonly AppDatabase _db;
    private readonly AuditService _audit;

    public PersonalFileService(AppDatabase db, AuditService audit)
    {
        _db    = db;
        _audit = audit;
    }

    public PersonalFile? GetByEmployeeId(int employeeId) =>
        _db.PersonalFiles.FirstOrDefault(f => f.EmployeeId == employeeId);

    public void AddDocument(int employeeId, Document document, int currentUserId)
    {
        var file = GetFileOrThrow(employeeId);

        document.Id = _db.NextDocumentId++;

        file.AddDocument(document);

        _audit.Log("ADD_DOCUMENT", employeeId, currentUserId);
    }

    public void AddLeaveRecord(int employeeId, LeaveRecord leave, int currentUserId)
    {
        var file = GetFileOrThrow(employeeId);

        if (leave.EndDate < leave.StartDate)
            throw new ArgumentException("Дата закінчення відпустки не може бути раніша за дату початку.");

        leave.Id = _db.NextLeaveId++;
        file.LeaveRecords.Add(leave);
        file.UpdatedAt = DateTime.Now;

        _audit.Log("ADD_LEAVE_RECORD", employeeId, currentUserId);
    }

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

    private PersonalFile GetFileOrThrow(int employeeId) =>
        GetByEmployeeId(employeeId)
        ?? throw new KeyNotFoundException(
            $"Особову справу для працівника ID={employeeId} не знайдено.");
}

public class AuditService
{
    private readonly AppDatabase _db;

    public AuditService(AppDatabase db)
    {
        _db = db;
    }

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

    public IEnumerable<AuditLog> GetAll() =>
        _db.AuditLogs.OrderByDescending(l => l.Timestamp);

    public IEnumerable<AuditLog> GetByEmployee(int employeeId) =>
        _db.AuditLogs
            .Where(l => l.EntityId == employeeId)
            .OrderByDescending(l => l.Timestamp);
}
