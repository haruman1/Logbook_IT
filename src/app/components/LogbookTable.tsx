import { Edit2, Trash2 } from 'lucide-react';
import type { LogbookEntry } from '../App';
import Swal from 'sweetalert2';
interface LogbookTableProps {
  entries: LogbookEntry[];
  onEdit: (entry: LogbookEntry) => void;
  onDelete: (no: number) => void;
}

export function LogbookTable({ entries, onEdit, onDelete }: LogbookTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Modul / Fitur
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Aktivitas
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Detail Teknis
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Kendala
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Solusi
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                PIC
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.no}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {entry.no}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {formatDate(entry.tanggal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div
                      className="max-w-[200px] truncate"
                      title={entry.modul_fitur}
                    >
                      {entry.modul_fitur}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div
                      className="max-w-[200px] truncate"
                      title={entry.aktivitas}
                    >
                      {entry.aktivitas}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div
                      className="max-w-[250px] truncate"
                      title={entry.detail_teknis}
                    >
                      {entry.detail_teknis || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div
                      className="max-w-[200px] truncate"
                      title={entry.kendala}
                    >
                      {entry.kendala || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div
                      className="max-w-[200px] truncate"
                      title={entry.solusi}
                    >
                      {entry.solusi || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(entry.status)}`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {entry.pic}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(entry)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: 'Konfirmasi Hapus',
                            text: 'Anda yakin ingin menghapus entry ini?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, hapus',
                            cancelButtonText: 'Batal',
                            confirmButtonColor: '#dc2626',
                            cancelButtonColor: '#9ca3af',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              onDelete(entry.no);
                            }
                          });
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
