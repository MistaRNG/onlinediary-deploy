import * as fs from 'fs';
import * as path from 'path';

const reports = [
  { path: '../../Frontend/client/test-report.html', title: 'Frontend Test Report' },
  { path: '../../Backend/server/webservices/auth-service/test-report.html', title: 'Auth Service Test Report' },
  { path: '../../Backend/server/webservices/comments-service/test-report.html', title: 'Comments Service Test Report' },
  { path: '../../Backend/server/webservices/gateway-service/test-report.html', title: 'Gateway Service Test Report' },
  { path: '../../Backend/server/webservices/journals-service/test-report.html', title: 'Journals Service Test Report' },
  { path: '../../Backend/server/webservices/likes-service/test-report.html', title: 'Likes Service Test Report' },
  { path: '../../Backend/server/webservices/mode-service/test-report.html', title: 'Mode Service Test Report' },
  { path: '../../Backend/server/webservices/users-service/test-report.html', title: 'Users Service Test Report' }
];

let combinedReport = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Kombinierter Testbericht</title>
</head>
<body>
`;

reports.forEach(({ path: reportPath, title }) => {
  if (fs.existsSync(reportPath)) {
    const reportContent = fs.readFileSync(reportPath, 'utf-8');

    combinedReport += `<h2>${title}</h2>\n${reportContent}\n`;
  } else {
    combinedReport += `<h2>${title}</h2>\n<p>Report not found: ${reportPath}</p>`;
  }
});

combinedReport += `
</body>
</html>
`;

const combinedReportPath = path.resolve('../../combined-test-report.html');

fs.writeFileSync(combinedReportPath, combinedReport, 'utf-8');

console.log(`Kombinierter Testbericht erstellt: ${combinedReportPath}`);
