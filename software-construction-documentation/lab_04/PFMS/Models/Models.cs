using PFMS.Enums;

namespace PFMS.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int? HeadEmployeeId { get; set; }

    public override string ToString() => $"[{Code}] {Name}";
}

public class Position
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int SalaryGrade { get; set; }

    public string GetCategory() => SalaryGrade switch
    {
        <= 5  => "Молодший персонал",
        <= 9  => "Середній персонал",
        _     => "Старший персонал"
    };

    public override string ToString() => $"{Title} (розряд {SalaryGrade}, {GetCategory()})";
}

public class LeaveRecord
{
    public int Id { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public LeaveType Type { get; set; }
    public bool Approved { get; set; } = false;

    public int GetDuration() => EndDate.DayNumber - StartDate.DayNumber + 1;

    public bool IsApproved() => Approved;

    public override string ToString() =>
        $"{Type} | {StartDate} – {EndDate} ({GetDuration()} дн.) | " +
        $"Схвалено: {(Approved ? "так" : "ні")}";
}

public class PerformanceReview
{
    public int Id { get; set; }
    public string Period { get; set; } = string.Empty;
    public float Score { get; set; }
    public string ReviewedBy { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;

    public string GetGrade() => Score switch
    {
        >= 4.5f => "Відмінно",
        >= 3.5f => "Добре",
        >= 2.5f => "Задовільно",
        _       => "Незадовільно"
    };

    public bool IsPassing() => Score >= 2.5f;

    public override string ToString() =>
        $"Період: {Period} | Бал: {Score:F1} ({GetGrade()}) | Рецензент: {ReviewedBy}";
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string Email { get; set; } = string.Empty;

    public bool HasPermission(string permission) => permission switch
    {
        "manage_users" => Role == UserRole.Administrator,
        "delete"       => Role is UserRole.Administrator or UserRole.HrManager,
        "write"        => Role is UserRole.Administrator or UserRole.HrManager,
        "read"         => true,
        _              => false
    };

    public override string ToString() => $"{Username} ({Role}) <{Email}>";
}

public class AuditLog
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int EntityId { get; set; }
    public int UserId { get; set; }

    public string Format() =>
        $"[{Timestamp:yyyy-MM-dd HH:mm:ss}] [{Action}] EntityId={EntityId} UserId={UserId}";

    public override string ToString() => Format();
}
