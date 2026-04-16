namespace PFMS.Models;

/// <summary>
/// Абстрактний базовий клас для всіх документів особової справи.
/// Відповідає абстрактному класу Document з діаграми класів (Лаб. №1).
/// Конкретні типи: IdentityDocument, EducationDocument, ContractDocument.
/// </summary>
public abstract class Document
{
    /// <summary>Унікальний ідентифікатор документа.</summary>
    public int Id { get; set; }

    /// <summary>Назва документа (наприклад, «Паспорт», «Диплом бакалавра»).</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Дата видачі документа.</summary>
    public DateOnly IssuedDate { get; set; }

    /// <summary>Шлях до скан-копії файлу (FR-003).</summary>
    public string FilePath { get; set; } = string.Empty;

    // ── Абстрактні методи ─────────────────────────────────────────────────

    /// <summary>
    /// Перевіряє дійсність документа. Реалізація залежить від типу документа.
    /// </summary>
    /// <returns>true — документ дійсний; false — прострочений або невалідний.</returns>
    public abstract bool Validate();

    /// <summary>
    /// Повертає тип документа у вигляді рядка.
    /// </summary>
    public abstract string GetDocumentType();

    /// <summary>Рядкове представлення для виведення у списках.</summary>
    public override string ToString() => $"[{GetDocumentType()}] {Title} від {IssuedDate}";
}

// ─────────────────────────────────────────────────────────────────────────────

/// <summary>
/// Документ, що посвідчує особу (паспорт, ID-картка).
/// </summary>
public class IdentityDocument : Document
{
    /// <summary>Серія та номер документа.</summary>
    public string SeriesNumber { get; set; } = string.Empty;

    /// <summary>Дата закінчення дії документа.</summary>
    public DateOnly ExpiryDate { get; set; }

    /// <inheritdoc/>
    /// <remarks>Документ дійсний, якщо строк дії ще не минув.</remarks>
    public override bool Validate() => ExpiryDate >= DateOnly.FromDateTime(DateTime.Today);

    /// <inheritdoc/>
    public override string GetDocumentType() => "Документ, що посвідчує особу";
}

// ─────────────────────────────────────────────────────────────────────────────

/// <summary>
/// Освітній документ (диплом, свідоцтво, сертифікат).
/// </summary>
public class EducationDocument : Document
{
    /// <summary>Назва навчального закладу, що видав документ.</summary>
    public string Institution { get; set; } = string.Empty;

    /// <summary>Спеціальність або напрям підготовки.</summary>
    public string Specialty { get; set; } = string.Empty;

    /// <inheritdoc/>
    /// <remarks>Освітній документ вважається завжди дійсним після видачі.</remarks>
    public override bool Validate() => IssuedDate <= DateOnly.FromDateTime(DateTime.Today);

    /// <inheritdoc/>
    public override string GetDocumentType() => "Освітній документ";
}

// ─────────────────────────────────────────────────────────────────────────────

/// <summary>
/// Трудовий договір або контракт.
/// </summary>
public class ContractDocument : Document
{
    /// <summary>Дата закінчення дії контракту (null — безстроковий).</summary>
    public DateOnly? ContractEndDate { get; set; }

    /// <inheritdoc/>
    /// <remarks>Контракт дійсний, якщо він безстроковий або ще не закінчився.</remarks>
    public override bool Validate() =>
        ContractEndDate is null || ContractEndDate >= DateOnly.FromDateTime(DateTime.Today);

    /// <inheritdoc/>
    public override string GetDocumentType() => "Трудовий договір";
}
