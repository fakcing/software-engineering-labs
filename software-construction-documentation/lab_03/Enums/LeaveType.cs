namespace PFMS.Enums;

/// <summary>
/// Тип відсутності працівника.
/// </summary>
public enum LeaveType
{
    /// <summary>Щорічна оплачувана відпустка.</summary>
    Annual,

    /// <summary>Лікарняний лист.</summary>
    SickLeave,

    /// <summary>Відпустка без збереження заробітної плати.</summary>
    Unpaid,

    /// <summary>Відпустка у зв'язку з вагітністю та пологами.</summary>
    Maternity
}
