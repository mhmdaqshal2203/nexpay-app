'use client';

import { useState } from 'react';
import { useEmployees } from '@/context/EmployeeContext';
import { useActivity } from '@/context/ActivityContext';
import { 
  Plus, PencilSimple, Trash, MagnifyingGlass, 
  Users, UserCirclePlus, Funnel
} from '@phosphor-icons/react';
import Modal from '@/components/Modal';
import styles from './Employees.module.css';

export default function Employees() {
  const { employees, addEmployee, editEmployee, deleteEmployee, formatIDR } = useEmployees();
  const { refreshActivities } = useActivity();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '', salary: '', status: 'Aktif' });
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.position.toLowerCase().includes(search.toLowerCase()) ||
    emp.id.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', position: '', salary: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingId(emp.id);
    setFormData({ name: emp.name, position: emp.position, salary: emp.salary, status: emp.status || 'Aktif' });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    await deleteEmployee(deleteConfirmId);
    if (refreshActivities) refreshActivities();
    setDeleteConfirmId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      position: formData.position,
      salary: parseFloat(formData.salary),
      status: formData.status
    };
    if (editingId) {
      await editEmployee(editingId, data);
    } else {
      await addEmployee(data);
    }
    if (refreshActivities) refreshActivities();
    setIsModalOpen(false);
  };

  return (
    <div className={`page-content ${styles.page}`}>

      {/* Page Header */}
      <div className={`${styles.pageHeader} animate-fade-in`}>
        <div>
          <h1 className="section-title">Data Karyawan</h1>
          <p className="section-subtitle">{employees.length} karyawan terdaftar dalam sistem</p>
        </div>
        <button className="btn-primary" onClick={openAddModal} id="btn-add-employee">
          <UserCirclePlus size={20} weight="fill" />
          Tambah Karyawan
        </button>
      </div>

      {/* Toolbar */}
      <div className={`${styles.toolbar} animate-fade-in-delay-1`}>
        <div className={styles.searchBox}>
          <MagnifyingGlass size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari nama, jabatan, atau ID..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="employee-search"
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <div className={styles.countBadge}>
            <Users size={14} />
            {filtered.length} karyawan
          </div>
          <button className="btn-secondary" id="btn-filter">
            <Funnel size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`glass-panel ${styles.tablePanel} animate-fade-in-delay-2`}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Users size={48} className={styles.emptyIcon} />
            <h3>Tidak ada karyawan ditemukan</h3>
            <p>{search ? `Tidak ada hasil untuk "${search}"` : 'Mulai dengan menambahkan karyawan pertama'}</p>
            {!search && (
              <button className="btn-primary" onClick={openAddModal}>
                <Plus size={16} /> Tambah Karyawan
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID Karyawan</th>
                  <th>Profil</th>
                  <th>Jabatan</th>
                  <th>Gaji Pokok</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr key={emp.id} className={styles.tableRow}>
                    <td className={styles.rowNumber}>{i + 1}</td>
                    <td>
                      <code className={styles.empId}>{emp.id}</code>
                    </td>
                    <td>
                      <div className="avatar-cell">
                        <img src={emp.avatar} alt={emp.name} className="avatar" />
                        <div>
                          <div className={styles.empName}>{emp.name}</div>
                          <div className={styles.empEmail}>{emp.name.toLowerCase().replace(/\s+/g, '.')}@nexpay.id</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.positionBadge}>{emp.position}</span>
                    </td>
                    <td>
                      <div className={styles.salaryCell}>
                        <span className={styles.salaryValue}>{formatIDR(emp.salary)}</span>
                        <span className={styles.salaryPer}>/bulan</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${(emp.status || 'Aktif') === 'Aktif' ? 'active' : 'inactive'}`}>
                        {emp.status || 'Aktif'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button
                          className={styles.editBtn}
                          onClick={() => openEditModal(emp)}
                          title="Edit karyawan"
                          id={`edit-${emp.id}`}
                        >
                          <PencilSimple size={16} weight="bold" />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(emp.id)}
                          title="Hapus karyawan"
                          id={`delete-${emp.id}`}
                        >
                          <Trash size={16} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
      >
        <form onSubmit={handleSubmit} className={styles.employeeForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Nama Lengkap <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className="glass-input"
                placeholder="Contoh: Budi Santoso"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                id="emp-name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Jabatan <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className="glass-input"
                placeholder="Contoh: Software Engineer"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                id="emp-position"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Gaji Pokok (Rp) <span className={styles.required}>*</span>
            </label>
            <div className={styles.salaryInputWrap}>
              <span className={styles.salaryPrefix}>Rp</span>
              <input
                type="number"
                className={`glass-input ${styles.salaryInput}`}
                placeholder="12000000"
                required
                min="0"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                id="emp-salary"
              />
            </div>
            {formData.salary && (
              <p className={styles.salaryPreview}>
                Preview: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(formData.salary) || 0)}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Status Karyawan <span className={styles.required}>*</span>
            </label>
            <select
              className="glass-input"
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              id="emp-status"
              style={{ padding: '0.8rem', background: 'var(--surface-1)' }}
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Calculation preview */}
          {formData.salary && parseFloat(formData.salary) > 0 && (
            <div className={styles.calcPreview}>
              <p className={styles.calcTitle}>Estimasi Perhitungan</p>
              <div className={styles.calcRow}>
                <span>Tunjangan (20%)</span>
                <span className={styles.positive}>+{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(formData.salary) * 0.2)}</span>
              </div>
              <div className={styles.calcRow}>
                <span>Potongan Pajak (5%)</span>
                <span className={styles.negative}>-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format((parseFloat(formData.salary) * 1.2) * 0.05)}</span>
              </div>
              <div className={`${styles.calcRow} ${styles.calcTotal}`}>
                <span>Gaji Bersih</span>
                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(formData.salary) * 1.2 * 0.95)}</span>
              </div>
            </div>
          )}

          <div className={styles.modalActions}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary" id="btn-save-employee">
              {editingId ? 'Simpan Perubahan' : 'Tambah Karyawan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Konfirmasi Hapus"
      >
        <div className={styles.deleteConfirm}>
          <div className={styles.deleteIcon}>
            <Trash size={28} weight="fill" />
          </div>
          <h3>Hapus Karyawan?</h3>
          <p>Tindakan ini tidak dapat dibatalkan. Data karyawan akan dihapus secara permanen dari sistem.</p>
          <div className={styles.deleteActions}>
            <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>
              Batal
            </button>
            <button className="btn-danger" onClick={confirmDelete} id="btn-confirm-delete">
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
