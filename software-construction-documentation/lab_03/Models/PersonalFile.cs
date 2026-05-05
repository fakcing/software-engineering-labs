namespace PFMS.Models;

public class PersonalFile
{
    public string FileNumber { get; set; } = string.Empty;
    public int EmployeeId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public bool IsArchived { get; set; } = false;
    public List<Document> Documents { get; set; } = new();
    public List<LeaveRecord> LeaveRecords { get; set; } = new();
    public List<PerformanceReview> PerformanceReviews { get; set; } = new();

    public void Archive()
    {
        if (IsArchived)
            throw new InvalidOperationException(
                $"Справа {FileNumber} вже є архівованою.");

        IsArchived = true;
        UpdatedAt = DateTime.Now;
    }

    public void AddDocument(Document document)
    {
        EnsureNotArchived();
        Documents.Add(document);
        UpdatedAt = DateTime.Now;
    }

    public string GetSummary() =>
        $"Справа {FileNumber} | Документів: {Documents.Count} | " +
        $"Відпусток: {LeaveRecords.Count} | Оцінок: {PerformanceReviews.Count} | " +
        $"Архів: {(IsArchived ? "так" : "ні")}";

    private void EnsureNotArchived()
    {
        if (IsArchived)
            throw new InvalidOperationException(
                $"Справа {FileNumber} архівована і не може бути змінена.");
    }
}
