using PFMS.Data;
using PFMS.Enums;
using PFMS.Models;

namespace PFMS.Services;

public class EmployeeService
{
    private readonly AppDatabase _db;
    private readonly AuditService _audit;

    public EmployeeService(AppDatabase db, AuditService audit)
    {
        _db    = db;
        _audit = audit;
    }

    public Employee Register(Employee employee, int currentUserId)
    {
        if (string.IsNullOrWhiteSpace(employee.FirstName))
            throw new ArgumentException("Ім'я працівника не може бути порожнім.");
        if (string.IsNullOrWhiteSpace(employee.LastName))
            throw new ArgumentException("Прізвище працівника не може бути порожнім.");

        employee.Id     = _db.NextEmployeeId++;
        employee.Status = EmployeeStatus.Active;

        _db.Employees.Add(employee);

        var file = new PersonalFile
        {
            FileNumber = GenerateFileNumber(),
            EmployeeId = employee.Id,
            CreatedAt  = DateTime.Now,
            UpdatedAt  = DateTime.Now,
        };
        _db.PersonalFiles.Add(file);

        _audit.Log("CREATE_EMPLOYEE", employee.Id, currentUserId);

        return employee;
    }

    public IEnumerable<Employee> GetAll() =>
        _db.Employees.Where(e => e.Status != EmployeeStatus.Archived);

    public Employee? GetById(int id) =>
        _db.Employees.FirstOrDefault(e => e.Id == id);

    public IEnumerable<Employee> Search(string query)
    {
        var q = query.ToLower();
        return _db.Employees.Where(e =>
            e.GetFullName().ToLower().Contains(q) ||
            GetDepartmentName(e.DepartmentId).ToLower().Contains(q) ||
            GetPositionTitle(e.PositionId).ToLower().Contains(q));
    }

    public void Update(Employee updated, int currentUserId)
    {
        var existing = GetById(updated.Id)
            ?? throw new KeyNotFoundException($"Працівника з ID={updated.Id} не знайдено.");

        existing.FirstName    = updated.FirstName;
        existing.LastName     = updated.LastName;
        existing.MiddleName   = updated.MiddleName;
        existing.BirthDate    = updated.BirthDate;
        existing.DepartmentId = updated.DepartmentId;
        existing.PositionId   = updated.PositionId;

        _audit.Log("UPDATE_EMPLOYEE", existing.Id, currentUserId);
    }

    public void SendOnLeave(int employeeId, int currentUserId)
    {
        var emp = GetActiveEmployee(employeeId);
        emp.Status = EmployeeStatus.OnLeave;
        _audit.Log("STATUS_ON_LEAVE", employeeId, currentUserId);
    }

    public void ReturnFromLeave(int employeeId, int currentUserId)
    {
        var emp = GetById(employeeId)
            ?? throw new KeyNotFoundException($"Працівника з ID={employeeId} не знайдено.");

        if (emp.Status != EmployeeStatus.OnLeave)
            throw new InvalidOperationException("Працівник не перебуває у відпустці.");

        emp.Status = EmployeeStatus.Active;
        _audit.Log("STATUS_RETURN_LEAVE", employeeId, currentUserId);
    }

    public void Suspend(int employeeId, int currentUserId)
    {
        var emp = GetActiveEmployee(employeeId);
        emp.Status = EmployeeStatus.Suspended;
        _audit.Log("STATUS_SUSPENDED", employeeId, currentUserId);
    }

    public void Reinstate(int employeeId, int currentUserId)
    {
        var emp = GetById(employeeId)
            ?? throw new KeyNotFoundException($"Працівника з ID={employeeId} не знайдено.");

        if (emp.Status != EmployeeStatus.Suspended)
            throw new InvalidOperationException("Працівник не є відстороненим.");

        emp.Status = EmployeeStatus.Active;
        _audit.Log("STATUS_REINSTATED", employeeId, currentUserId);
    }

    public void Terminate(int employeeId, int currentUserId)
    {
        var emp = GetById(employeeId)
            ?? throw new KeyNotFoundException($"Працівника з ID={employeeId} не знайдено.");

        emp.Terminate();

        var file = _db.PersonalFiles.FirstOrDefault(f => f.EmployeeId == employeeId);
        file?.Archive();

        emp.Status = EmployeeStatus.Archived;

        _audit.Log("TERMINATE_EMPLOYEE", employeeId, currentUserId);
    }

    public string GetDepartmentName(int id) =>
        _db.Departments.FirstOrDefault(d => d.Id == id)?.Name ?? "—";

    public string GetPositionTitle(int id) =>
        _db.Positions.FirstOrDefault(p => p.Id == id)?.Title ?? "—";

    private string GenerateFileNumber() =>
        $"PF-{DateTime.Now.Year}-{_db.NextFileSeq++:D4}";

    private Employee GetActiveEmployee(int id)
    {
        var emp = GetById(id)
            ?? throw new KeyNotFoundException($"Працівника з ID={id} не знайдено.");

        if (!emp.IsActive())
            throw new InvalidOperationException(
                $"Операція недоступна для працівника зі статусом '{emp.Status}'.");

        return emp;
    }
}
