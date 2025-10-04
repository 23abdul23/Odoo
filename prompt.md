# Odoo



Create a monorepo with two separate folders:


frontend → React.js app (all files in .jsx, do not use TypeScript)


backend → Node.js + Express app (all files in .js, do not use TypeScript)


Root README.md should explain how to run both frontend and backend.



🌐 Frontend (React.js – no TypeScript, only .jsx files)
Use React Router for navigation.


Pages:


Login / Signup page → Auth system.


Dashboard (role-based):


Employee → Submit Expense, View My Expenses.


Manager → Pending Approvals, Team Expenses.


Admin → Manage Users, Configure Approval Rules, View All Expenses.


Expense Submission Form (with fields: amount, currency, category, description, date, file upload for receipt).


OCR Integration → When user uploads a receipt, call backend OCR API to auto-fill expense details.


State management with Redux Toolkit (or Context API).


API calls to backend using axios.


UI → clean and minimal (you may use TailwindCSS).



⚙️ Backend (Node.js + Express – no TypeScript, only .js)
Implement authentication & JWT-based session management.


REST API routes:


Auth → /auth/signup, /auth/login


Users → /users/create, /users/:id/update-role, /users/:id/manager


Expenses → /expenses/create, /expenses/:id/approve, /expenses/:id/reject, /expenses/history


Approval Rules → /rules/create, /rules/update, /rules/get


OCR → /ocr/upload (use tesseract.js or Google Vision API)


Currency → integrate with


https://restcountries.com/v3.1/all?fields=name,currencies (for country & currency)


https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY} (for conversions).


Multi-level approval workflow implementation:


Sequential approvals (Manager → Finance → Director).


Conditional rules (percentage approvals, specific approver auto-approve, hybrid rules).


Role permissions enforcement (Admin, Manager, Employee).


Database → Use MongoDB with Mongoose models:


User (id, name, email, role, managerId, companyId)


Company (id, name, country, currency)


Expense (id, employeeId, amount, currency, convertedAmount, status, approvals[], comments[], receiptUrl)


ApprovalRule (id, companyId, type, percentage, specificApproverId, sequence[])



🔑 Core Features
On signup, auto-create a new company with default currency (from selected country) and set the user as Admin.


Employees can submit expenses in any currency → backend auto-converts to company’s currency using API.


Approval workflow:


Expense request moves to next approver only after current one approves/rejects.


Support conditional approval flows (percentage-based, specific approver, hybrid).


Managers/Admins can add comments when approving/rejecting.


Admin can override approvals.


OCR auto-fills expense form when receipt is uploaded.



🚫 Important Restrictions
❌ Do NOT use TypeScript anywhere (frontend or backend).


❌ All frontend files must be .jsx, not .tsx.


❌ Backend should only use .js.



⚡ Now generate the full codebase with proper folder structure, routes, components, and database models.


