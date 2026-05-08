namespace PFMS.Models;

public abstract class Document
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateOnly IssuedDate { get; set; }
    public string FilePath { get; set; } = string.Empty;

    public abstract bool Validate();

    public abstract string GetDocumentType();

    public override string ToString() => $"[{GetDocumentType()}] {Title} від {IssuedDate}";
}

public class IdentityDocument : Document
{
    public string SeriesNumber { get; set; } = string.Empty;
    public DateOnly ExpiryDate { get; set; }

    public override bool Validate() => ExpiryDate >= DateOnly.FromDateTime(DateTime.Today);

    public override string GetDocumentType() => "Документ, що посвідчує особу";
}

public class EducationDocument : Document
{
    public string Institution { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;

    public override bool Validate() => IssuedDate <= DateOnly.FromDateTime(DateTime.Today);

    public override string GetDocumentType() => "Освітній документ";
}

public class ContractDocument : Document
{
    public DateOnly? ContractEndDate { get; set; }

    public override bool Validate() =>
        ContractEndDate is null || ContractEndDate >= DateOnly.FromDateTime(DateTime.Today);

    public override string GetDocumentType() => "Трудовий договір";
}
