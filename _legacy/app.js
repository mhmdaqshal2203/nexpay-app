// Mock Data
let employees = [
    { id: 'EMP-001', name: 'Budi Santoso', position: 'Software Engineer', salary: 12000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
    { id: 'EMP-002', name: 'Siti Aminah', position: 'UI/UX Designer', salary: 10000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
    { id: 'EMP-003', name: 'Ahmad Faisal', position: 'Product Manager', salary: 15000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad' }
];

// Utility: Format Currency
const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('page-title');

// Modals
const employeeModal = document.getElementById('employee-modal');
const payslipModal = document.getElementById('payslip-modal');
const employeeForm = document.getElementById('employee-form');

// App State
let currentView = 'dashboard';

// --- Routing & Navigation ---
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        
        // Update active nav
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        // Update views
        viewSections.forEach(v => v.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        
        // Update title
        pageTitle.textContent = item.textContent.trim();
        currentView = target;
        
        renderCurrentView();
    });
});

// --- Renders ---
const renderCurrentView = () => {
    if (currentView === 'dashboard') renderDashboard();
    if (currentView === 'employees') renderEmployees();
    if (currentView === 'payroll') renderPayroll();
};

const renderDashboard = () => {
    document.getElementById('stat-total-employees').textContent = employees.length;
    
    // Calculate total estimated payroll (base + 20% allowance - 5% tax)
    const totalBase = employees.reduce((acc, emp) => acc + emp.salary, 0);
    const totalAllowance = totalBase * 0.20;
    const totalTax = (totalBase + totalAllowance) * 0.05;
    const totalNet = totalBase + totalAllowance - totalTax;
    
    document.getElementById('stat-total-payroll').textContent = formatIDR(totalNet);
    
    // Render Recent Employees (last 5)
    const recentTable = document.getElementById('recent-employees-table');
    recentTable.innerHTML = '';
    const recent = [...employees].reverse().slice(0, 5);
    
    recent.forEach(emp => {
        recentTable.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>
                    <div class="employee-cell">
                        <img src="${emp.avatar}" alt="${emp.name}">
                        <span>${emp.name}</span>
                    </div>
                </td>
                <td>${emp.position}</td>
                <td><span class="badge active">Aktif</span></td>
            </tr>
        `;
    });
};

const renderEmployees = () => {
    const table = document.getElementById('employees-table');
    table.innerHTML = '';
    
    employees.forEach((emp, index) => {
        table.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>
                    <div class="employee-cell">
                        <img src="${emp.avatar}" alt="${emp.name}">
                        <span>${emp.name}</span>
                    </div>
                </td>
                <td>${emp.position}</td>
                <td>${formatIDR(emp.salary)}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-secondary btn-sm" onclick="editEmployee(${index})"><i class="ph ph-pencil"></i></button>
                        <button class="btn-secondary btn-sm" onclick="deleteEmployee(${index})" style="color: var(--danger);"><i class="ph ph-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
};

const renderPayroll = () => {
    const table = document.getElementById('payroll-table');
    table.innerHTML = '';
    
    employees.forEach(emp => {
        const allowance = emp.salary * 0.20;
        const tax = (emp.salary + allowance) * 0.05;
        const netSalary = emp.salary + allowance - tax;
        
        table.innerHTML += `
            <tr>
                <td>
                    <div class="employee-cell">
                        <img src="${emp.avatar}" alt="${emp.name}">
                        <span>${emp.name}</span>
                    </div>
                </td>
                <td>${formatIDR(emp.salary)}</td>
                <td style="color: var(--success);">+ ${formatIDR(allowance)}</td>
                <td style="color: var(--danger);">- ${formatIDR(tax)}</td>
                <td style="font-weight: 600;">${formatIDR(netSalary)}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="showPayslip('${emp.id}')"><i class="ph ph-receipt"></i> Slip</button>
                </td>
            </tr>
        `;
    });
};

// --- Employee Management Actions ---
document.getElementById('btn-add-employee').addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Tambah Karyawan';
    employeeForm.reset();
    document.getElementById('emp-id').value = '';
    employeeModal.classList.add('show');
});

document.getElementById('btn-close-modal').addEventListener('click', () => {
    employeeModal.classList.remove('show');
});

document.getElementById('btn-cancel-modal').addEventListener('click', () => {
    employeeModal.classList.remove('show');
});

employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idField = document.getElementById('emp-id').value;
    const name = document.getElementById('emp-name').value;
    const position = document.getElementById('emp-position').value;
    const salary = parseFloat(document.getElementById('emp-salary').value);
    
    if (idField) {
        // Edit
        const empIndex = employees.findIndex(e => e.id === idField);
        if (empIndex > -1) {
            employees[empIndex].name = name;
            employees[empIndex].position = position;
            employees[empIndex].salary = salary;
        }
    } else {
        // Add new
        const newId = 'EMP-' + String(employees.length + 1).padStart(3, '0');
        employees.push({
            id: newId,
            name,
            position,
            salary,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, '')}`
        });
    }
    
    employeeModal.classList.remove('show');
    renderCurrentView();
});

window.editEmployee = (index) => {
    const emp = employees[index];
    document.getElementById('modal-title').textContent = 'Edit Karyawan';
    document.getElementById('emp-id').value = emp.id;
    document.getElementById('emp-name').value = emp.name;
    document.getElementById('emp-position').value = emp.position;
    document.getElementById('emp-salary').value = emp.salary;
    employeeModal.classList.add('show');
};

window.deleteEmployee = (index) => {
    if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
        employees.splice(index, 1);
        renderCurrentView();
    }
};

// --- Payslip Actions ---
window.showPayslip = (id) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    
    const allowance = emp.salary * 0.20;
    const tax = (emp.salary + allowance) * 0.05;
    const netSalary = emp.salary + allowance - tax;
    
    const content = document.getElementById('payslip-content');
    const date = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    
    content.innerHTML = `
        <div class="payslip-header">
            <h2>NexPay</h2>
            <p>Slip Gaji Periode: ${date}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <p><strong>ID Karyawan:</strong> ${emp.id}</p>
            <p><strong>Nama:</strong> ${emp.name}</p>
            <p><strong>Jabatan:</strong> ${emp.position}</p>
        </div>
        
        <div class="payslip-row">
            <span>Gaji Pokok</span>
            <span>${formatIDR(emp.salary)}</span>
        </div>
        <div class="payslip-row">
            <span>Tunjangan (20%)</span>
            <span style="color: var(--success);">+ ${formatIDR(allowance)}</span>
        </div>
        <div class="payslip-row">
            <span>Potongan Pajak (5%)</span>
            <span style="color: var(--danger);">- ${formatIDR(tax)}</span>
        </div>
        <div class="payslip-row total">
            <span>Total Penerimaan Bersih</span>
            <span>${formatIDR(netSalary)}</span>
        </div>
    `;
    
    payslipModal.classList.add('show');
};

document.getElementById('btn-close-payslip').addEventListener('click', () => {
    payslipModal.classList.remove('show');
});

// Initial Render
renderDashboard();
