using PFMS.Data;
using PFMS.Models;

namespace PFMS.Tests;

public class AuxiliaryTests
{
    private static string TempPath() =>
        Path.Combine(Path.GetTempPath(), $"pfms_test_{Guid.NewGuid()}.json");

    // TC-AUX-01: Save() створює JSON-файл за вказаним шляхом
    [Fact]
    public void Save_CreatesFileAtSpecifiedPath()
    {
        var db   = new AppDatabase();
        var path = TempPath();

        try
        {
            db.Save(path);

            Assert.True(File.Exists(path));
        }
        finally
        {
            File.Delete(path);
        }
    }

    // TC-AUX-02: Save() зберігає дані, Load() їх відновлює
    [Fact]
    public void SaveAndLoad_RoundTrip_PreservesEmployeeCount()
    {
        var db = new AppDatabase();
        db.Employees.Add(new Employee { Id = 1, FirstName = "Іван", LastName = "Тест",
                                        Status = Enums.EmployeeStatus.Active });
        db.NextEmployeeId = 2;
        var path = TempPath();

        try
        {
            db.Save(path);
            var loaded = AppDatabase.Load(path);

            Assert.Single(loaded.Employees);
            Assert.Equal("Тест", loaded.Employees[0].LastName);
        }
        finally
        {
            File.Delete(path);
        }
    }

    // TC-AUX-03: Load() для неіснуючого файлу повертає seed-дані
    [Fact]
    public void Load_NonExistingFile_ReturnsSeedData()
    {
        var path = TempPath();

        var db = AppDatabase.Load(path);

        Assert.NotEmpty(db.Employees);
        Assert.NotEmpty(db.Departments);
        Assert.NotEmpty(db.Users);
    }

    // TC-AUX-04: Load() для пошкодженого JSON повертає seed-дані без виключення
    [Fact]
    public void Load_CorruptedJson_ReturnsSeedDataWithoutException()
    {
        var path = TempPath();
        File.WriteAllText(path, "{ це не валідний json !!!}");

        try
        {
            var db = AppDatabase.Load(path);

            Assert.NotEmpty(db.Employees);
        }
        finally
        {
            File.Delete(path);
        }
    }

    // TC-AUX-05: PersonalFile.Archive() встановлює IsArchived = true
    [Fact]
    public void Archive_SetsIsArchivedToTrue()
    {
        var file = new PersonalFile { FileNumber = "PF-2026-0001" };

        file.Archive();

        Assert.True(file.IsArchived);
    }

    // TC-AUX-06: PersonalFile.Archive() вдруге — InvalidOperationException
    [Fact]
    public void Archive_AlreadyArchived_ThrowsInvalidOperationException()
    {
        var file = new PersonalFile { FileNumber = "PF-2026-0001" };
        file.Archive();

        Assert.Throws<InvalidOperationException>(() => file.Archive());
    }
}
