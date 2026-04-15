namespace PFMS.Enums;

/// <summary>
/// Роль користувача системи (RBAC — Role-Based Access Control).
/// Відповідає вимозі FR-006 та нефункціональній вимозі «Безпека».
/// </summary>
public enum UserRole
{
    /// <summary>HR-менеджер: повний доступ до особових справ.</summary>
    HrManager,

    /// <summary>Директор: перегляд і затвердження.</summary>
    Director,

    /// <summary>Адміністратор системи: управління користувачами.</summary>
    Administrator
}
