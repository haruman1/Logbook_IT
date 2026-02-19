import { useState, useEffect } from 'react';
import { LogbookTable } from './components/LogbookTable';
import { LogbookForm } from './components/LogbookForm';
import { Plus, FileDown, RefreshCw } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Swal from 'sweetalert2';
import { LogbookDetailDialog } from './components/LogbookDetail';
export interface LogbookEntry {
  no: number;
  tanggal: Date | string;
  modul_fitur: string;
  aktivitas: string;
  detail_teknis: string;
  kendala: string;
  solusi: string;
  status: string;
  pic: string;
}
type Rows = LogbookEntry[];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogbookEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<Rows>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(99999);
  const [totalRows, setTotalRows] = useState(0);
  /* ================= FETCH LIST ================= */
  const fetchLogbookEntries = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/logbook/list?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}`,
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memuat data');
      }

      const safeData: LogbookEntry[] = (result.data ?? []).map((item: any) => ({
        no: item.no ?? 0,
        tanggal: item.tanggal ? new Date(item.tanggal) : new Date(),
        modul_fitur: item.modul_fitur ?? '',
        aktivitas: item.aktivitas ?? '',
        detail_teknis: item.detail_teknis ?? '',
        kendala: item.kendala ?? '',
        solusi: item.solusi ?? '',
        status: item.status ?? '',
        pic: item.pic ?? '',
      }));

      setEntries(safeData);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data logbook');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogbookEntries();
  }, []);

  /* ================= CREATE  ================= */
  const handleAddEntry = async (
    entry: Omit<LogbookEntry, 'no'>,
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/logbook/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success('Entry berhasil ditambahkan');
      await fetchLogbookEntries();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan entry');
    }
  };
  /* ================= Detail ================= */
  const handleDetailEntry = (entry: LogbookEntry): void => {
    setEditingEntry(entry);
    setIsDetailOpen(true);
  };
  /* ================= UPDATE ================= */
  const handleEditEntry = async (
    entry: Omit<LogbookEntry, 'no'>,
  ): Promise<void> => {
    if (!editingEntry) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/logbook/update/${editingEntry.no}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // throw new Error(result.message);
        toast.error(result.message);
      }

      toast.success(result.message);
      console.log(result);
      await fetchLogbookEntries();
      setEditingEntry(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengupdate entry');
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteEntry = async (no: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/logbook/delete/${no}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success('Entry berhasil dihapus');
      await fetchLogbookEntries();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus entry');
    }
  };

  /* ================= EXPORT CSV ================= */
  const handleExportToExcel = (): void => {
    const headers = [
      'No',
      'Tanggal',
      'Modul/Fitur',
      'Aktivitas',
      'Detail Teknis',
      'Kendala',
      'Solusi',
      'Status',
      'PIC',
    ];

    const csvRows = filteredEntries.map((e) => [
      e.no,
      e.tanggal,
      e.modul_fitur,
      e.aktivitas,
      e.detail_teknis,
      e.kendala,
      e.solusi,
      e.status,
      e.pic,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logbook_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Data berhasil diexport');
  };

  /* ================= FILTER ================= */
  const filteredEntries = entries.filter((entry) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      entry.modul_fitur.toLowerCase().includes(search) ||
      entry.aktivitas.toLowerCase().includes(search) ||
      entry.pic.toLowerCase().includes(search) ||
      entry.detail_teknis.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'all' || entry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(
    new Set(entries.map((e) => e.status)),
  ).filter(Boolean);

  /* ================= FORM HANDLER ================= */
  const openAddForm = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const openEditForm = (entry: LogbookEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingEntry(null);
    setIsFormOpen(false);
  };

  /* ================= UI  ================= */
  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Logbook TIM IT
            </h1>
            <p className="text-gray-600">
              Dokumentasi aktivitas dan progress project
            </p>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                <input
                  type="text"
                  placeholder="Cari modul, aktivitas, PIC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
                />

                <select
                  title="Filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">Semua Status</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={fetchLogbookEntries}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg"
                >
                  <RefreshCw className={isLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>

                <button
                  onClick={handleExportToExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  <FileDown /> Export
                </button>

                <button
                  onClick={openAddForm}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  <Plus /> Tambah Entry
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {!isLoading && (
            <LogbookTable
              entries={filteredEntries}
              onEdit={openEditForm}
              onDelete={handleDeleteEntry}
            />
          )}

          {/* Form Modal */}
          {isFormOpen && (
            <LogbookForm
              entry={editingEntry}
              onSubmit={editingEntry ? handleEditEntry : handleAddEntry}
              onClose={closeForm}
            />
          )}
        </div>
      </div>
    </>
  );
}
