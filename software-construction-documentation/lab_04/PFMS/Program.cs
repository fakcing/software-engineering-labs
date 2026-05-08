using PFMS.Data;
using PFMS.Services;
using PFMS.UI;

const string DataPath = "data/pfms.json";

var db = AppDatabase.Load(DataPath);

var auditService    = new AuditService(db);
var employeeService = new EmployeeService(db, auditService);
var fileService     = new PersonalFileService(db, auditService);

var menu = new ConsoleMenu(db, employeeService, fileService, auditService);
menu.Run();
