using PFMS.Enums;

namespace PFMS.Models;

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string MiddleName { get; set; } = string.Empty;
    public DateOnly BirthDate { get; set; }
    public DateOnly HireDate { get; set; }
    public EmployeeStatus Status { get; set; } = EmployeeStatus.New;
    public int DepartmentId { get; set; }
    public int PositionId { get; set; }

    public string GetFullName() => $"{LastName} {FirstName} {MiddleName}".Trim();

    public bool IsActive() => Status == EmployeeStatus.Active;

    public void Terminate()
    {
        if (Status is EmployeeStatus.Terminated or EmployeeStatus.Archived)
            throw new InvalidOperationException(
                $"Неможливо звільнити працівника зі статусом '{Status}'.");

        Status = EmployeeStatus.Terminated;
    }

    public override string ToString() =>
        $"[{Id:D4}] {GetFullName()} | Статус: {Status} | Прийнято: {HireDate}";
}
