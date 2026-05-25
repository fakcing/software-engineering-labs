using PFMS.Data;
using PFMS.Enums;
using PFMS.Models;
using PFMS.Services;

namespace PFMS.Tests;

public class BusinessLogicTests
{
    private static (AppDatabase db, EmployeeService svc) CreateServices()
    {
        var db    = new AppDatabase();
        var audit = new AuditService(db);
        var svc   = new EmployeeService(db, audit);
        return (db, svc);
    }

    // TC-BL-01: Реєстрація працівника з коректними даними
    [Fact]
    public void Register_ValidEmployee_AssignsActiveStatusAndCreatesFile()
    {
        var (db, svc) = CreateServices();
        var emp = new Employee { FirstName = "Іван", LastName = "Коваленко" };

        var result = svc.Register(emp, currentUserId: 1);

        Assert.Equal(EmployeeStatus.Active, result.Status);
        Assert.True(result.Id > 0);
        Assert.Single(db.PersonalFiles);
        Assert.Equal(result.Id, db.PersonalFiles[0].EmployeeId);
    }

    // TC-BL-02: Реєстрація з порожнім іменем — має кинути ArgumentException
    [Fact]
    public void Register_EmptyFirstName_ThrowsArgumentException()
    {
        var (_, svc) = CreateServices();
        var emp = new Employee { FirstName = "", LastName = "Коваленко" };

        Assert.Throws<ArgumentException>(() => svc.Register(emp, currentUserId: 1));
    }

    // TC-BL-03: GetGrade() повертає "Відмінно" для балу 4.8
    [Fact]
    public void GetGrade_Score4point8_ReturnsVidminno()
    {
        var review = new PerformanceReview { Score = 4.8f };

        var grade = review.GetGrade();

        Assert.Equal("Відмінно", grade);
    }

    // TC-BL-04: GetGrade() повертає "Незадовільно" для балу 2.0
    [Fact]
    public void GetGrade_Score2point0_ReturnsNezadovilno()
    {
        var review = new PerformanceReview { Score = 2.0f };

        var grade = review.GetGrade();

        Assert.Equal("Незадовільно", grade);
    }

    // TC-BL-05: SendOnLeave() переводить активного працівника у відпустку
    [Fact]
    public void SendOnLeave_ActiveEmployee_SetsOnLeaveStatus()
    {
        var (_, svc) = CreateServices();
        var emp = new Employee { FirstName = "Оксана", LastName = "Мельник" };
        svc.Register(emp, currentUserId: 1);

        svc.SendOnLeave(emp.Id, currentUserId: 1);

        Assert.Equal(EmployeeStatus.OnLeave, emp.Status);
    }

    // TC-BL-06: SendOnLeave() для неактивного працівника — InvalidOperationException
    [Fact]
    public void SendOnLeave_AlreadyOnLeaveEmployee_ThrowsInvalidOperationException()
    {
        var (_, svc) = CreateServices();
        var emp = new Employee { FirstName = "Оксана", LastName = "Мельник" };
        svc.Register(emp, currentUserId: 1);
        svc.SendOnLeave(emp.Id, currentUserId: 1);

        Assert.Throws<InvalidOperationException>(() =>
            svc.SendOnLeave(emp.Id, currentUserId: 1));
    }

    // TC-BL-07: GetDuration() повертає коректну кількість днів
    [Fact]
    public void GetDuration_Returns21Days()
    {
        var leave = new LeaveRecord
        {
            StartDate = new DateOnly(2026, 6, 1),
            EndDate   = new DateOnly(2026, 6, 21),
        };

        Assert.Equal(21, leave.GetDuration());
    }

    // TC-BL-08: Search() знаходить за частиною імені
    [Fact]
    public void Search_PartialName_ReturnsMatchingEmployees()
    {
        var (_, svc) = CreateServices();
        svc.Register(new Employee { FirstName = "Тарас", LastName = "Шевченко" }, 1);
        svc.Register(new Employee { FirstName = "Оксана", LastName = "Мельник"  }, 1);

        var results = svc.Search("Шевч").ToList();

        Assert.Single(results);
        Assert.Equal("Шевченко", results[0].LastName);
    }
}
