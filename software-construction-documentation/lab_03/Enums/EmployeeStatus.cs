namespace PFMS.Enums;

/// <summary>
/// Статус особової справи працівника.
/// Відповідає станам діаграми State Machine з Лабораторної роботи №2.
/// </summary>
public enum EmployeeStatus
{
    /// <summary>Щойно створений запис, дані ще не підтверджені.</summary>
    New,

    /// <summary>Працівник активний, перебуває на роботі.</summary>
    Active,

    /// <summary>Працівник у відпустці або на лікарняному.</summary>
    OnLeave,

    /// <summary>Тимчасово відсторонений від роботи.</summary>
    Suspended,

    /// <summary>Звільнений. Кінцевий робочий стан.</summary>
    Terminated,

    /// <summary>Справа архівована. Незворотний кінцевий стан (FR-008).</summary>
    Archived
}
