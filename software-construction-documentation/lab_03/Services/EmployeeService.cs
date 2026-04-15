using PFMS.Data;
using PFMS.Enums;
using PFMS.Models;

namespace PFMS.Services;

/// <summary>
/// Сервіс управління даними працівників.
/// Відповідає модулю «Employee Module» з Лабораторної роботи №1.
/// Реалізує операції CRUD та зміни статусу відповідно до State Machine (Лаб. №2).
/// </summary>
public class EmployeeService
{
    private readonly AppDatabase _db;
    private readonly AuditService _audit;

    public EmployeeService(AppDatabase db, AuditService audit)
    {
        _db    = db;
        _audit = audit;
    }

    // ── Create ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Реєструє нового працівника та автоматично створює для нього особову справу (FR-001, FR-002).
    /// Відповідає процесу з діаграми діяльності (Лаб. №2, Рисунок 1.1).
    /// </summary>
    /// <param name="employee">Дані нового працівника.</param>
    /// <param name="currentUserId">Ідентифікатор HR-менеджера, що виконує реєстрацію.</param>
    /// <returns>Зареєстрований працівник із присвоєним ID.</returns>
    /// <exception cref="ArgumentException">Порожнє ім'я або прізвище.</exception>
    public Employee Register(Employee employee, int currentUserId)
    {
        // Валідація вхідних даних
        if (string.IsNullOrWhiteSpace(employee.FirstName))
            throw new ArgumentException("Ім'я працівника не може бути порожнім.");
        if (string.IsNullOrWhiteSpace(employee.LastName))
            throw new ArgumentException("Прізвище працівника не може бути порожнім.");

        // Присвоюємо ID та активуємо
        employee.Id     = _db.NextEmployeeId++;
        employee.Status = EmployeeStatus.Active;

        _db.Employees.Add(employee);

        // Автоматично створюємо особову справу (FR-002)
        var file = new PersonalFile
        {
            FileNumber = GenerateFileNumber(),
            EmployeeId = employee.Id,
            CreatedAt  = DateTime.Now,
            UpdatedAt  = DateTime.Now,
        };
        _db.PersonalFiles.Add(file);

        // Фіксуємо в журналі аудиту (FR-006)
        _audit.Log("CREATE_EMPLOYEE", employee.Id, currentUserId);

        return employee;
    }

    // ── Read ───────────────────────────────────────────────────────────────

    /// <summary>
    /// Повертає всіх активних (не архівованих) працівників.
    /// </summary>
    public IEnumerable<Employee> GetAll() =>
        _db.Employees.Where(e => e.Status != EmployeeStatus.Archived);

    /// <summary>
    /// Знаходить працівника за ID. Повертає null якщо не знайдено.
    /// </summary>
    public Employee? GetById(int id) =>
        _db.Employees.FirstOrDefault(e => e.Id == id);

    /// <summary>
    /// Пошук працівників за ім'ям, відділом або посадою (FR-007).
    /// Пошук нечутливий до регістру.
    /// </summary>
    /// <param name="query">Рядок для пошуку.</param>
    public IEnumerable<Employee> Search(string query)
    {
        var q = query.ToLower();
        return _db.Employees.Where(e =>
            e.GetFullName().ToLower().Contains(q) ||
            GetDepartmentName(e.DepartmentId).ToLower().Contains(q) ||
            GetPositionTitle(e.PositionId).ToLower().Contains(q));
    }

    // ── Update ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Оновлює дані працівника (ім'я, дата народження, відділ, посада).
    /// </summary>
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

    // ── Зміни статусу (State Machine) ─────────────────────────────────────

    /// <summary>
    /// Переводить працівника у статус «У відпустці» (перехід ACTIVE → ON_LEAVE).
    /// </summary>
    public void SendOnLeave(int employeeId, int currentUserId)
    {
        var emp = GetActiveEmployee(employeeId);
        emp.Status = EmployeeStatus.OnLeave;
        _audit.Log("STATUS_ON_LEAVE", employeeId, currentUserId);
    }

    /// <summary>
    /// Повертає працівника з відпустки (перехід ON_LEAVE → ACTIVE).
    /// </summary>
    public void ReturnFromLeave(int employeeId, int currentUserId)
    {
        var emp = GetById(employeeId)
            ?? throw new KeyNotFoundException($"Працівника з ID={employeeId} не знайдено.");

        if (emp.Status != EmployeeStatus.OnLeave)
            throw new InvalidOperationException("Працівник не перебуває у відпустці.");

        emp.Status = EmployeeStatus.Active;
        _audit.Log("STATUS_RETURN_LEAVE", employeeId, currentUserId);
    }

    /// <summary>
    /// Відстороняє працівника (перехід ACTIVE → SUSPENDED).
    /// </summary>
    public void Suspend(int employeeId, int currentUserId)
    {
        var emp = GetActiveEmployee(employeeId);
        emp.Status = EmployeeStatus.Suspended;
        _audit.Log("STATUS_SUSPENDED", employeeId, currentUserId);
    }

    /// <summary>
    /// Відновлює відстороненого працівника (перехід SUSPENDED → ACTIVE).
    /// </summary>
    public void Reinstate(int employeeId, int currentUserId)
    {
        var emp = GetById(employeeId)
            ?? throw new KeyNotFoundException($"Працівника з ID={employeeId} не знайдено.");

        if (emp.Status != EmployeeStatus.Suspended)
            throw new InvalidOperationException("Працівник не є відстороненим.");

        emp.Status = EmployeeStatus.Active;
        _audit.Log("STATUS_REINSTATED", employeeId, currentUserId);
    }

    /// <summary>
    /// Звільняє працівника та архівує його особову справу (FR-008).
    /// Реалізує переходи: ACTIVE/ON_LEAVE/SUSPENDED → TERMINATED → ARCHIVED.
    /// </summary>
    public void Terminate(int employeeId, int currentUserId)
    {
        var emp = GetById(employeeId)
            ?? throw new KeyNotFoundException($"Працівника з ID={employeeId} не знайдено.");

        emp.Terminate(); // виконує перехід у TERMINATED

        // Автоматично архівуємо особову справу (FR-008)
        var file = _db.PersonalFiles.FirstOrDefault(f => f.EmployeeId == employeeId);
        file?.Archive();

        emp.Status = EmployeeStatus.Archived;

        _audit.Log("TERMINATE_EMPLOYEE", employeeId, currentUserId);
    }

    // ── Допоміжні ──────────────────────────────────────────────────────────

    /// <summary>Повертає назву відділу за ID або «—» якщо не знайдено.</summary>
    public string GetDepartmentName(int id) =>
        _db.Departments.FirstOrDefault(d => d.Id == id)?.Name ?? "—";

    /// <summary>Повертає назву посади за ID або «—» якщо не знайдено.</summary>
    public string GetPositionTitle(int id) =>
        _db.Positions.FirstOrDefault(p => p.Id == id)?.Title ?? "—";

    /// <summary>Генерує номер справи у форматі PF-YYYY-NNNN.</summary>
    private string GenerateFileNumber() =>
        $"PF-{DateTime.Now.Year}-{_db.NextFileSeq++:D4}";

    /// <summary>
    /// Знаходить активного працівника або кидає виняток.
    /// </summary>
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
