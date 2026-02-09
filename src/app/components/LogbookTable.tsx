import { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { LogbookEntry } from '../App';
import { LogbookDetailDialog } from './LogbookDetail';

interface LogbookTableProps {
  entries: LogbookEntry[];
  onEdit: (entry: LogbookEntry) => void;
  onDelete: (no: number) => void;
}

export function LogbookTable({ entries, onEdit, onDelete }: LogbookTableProps) {
  const [detailEntry, setDetailEntry] = useState<LogbookEntry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (entry: LogbookEntry) => {
    setDetailEntry(entry);
    setIsDetailOpen(true);
  };

  const handleDelete = (no: number) => {
    if (window.confirm('Yakin ingin menghapus entry ini?')) {
      onDelete(no);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Modul/Fitur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aktivitas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  PIC
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.no} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{entry.no}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(entry.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm">{entry.modul_fitur}</td>
                    <td className="px-4 py-3 text-sm">{entry.aktivitas}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          entry.status === 'Done'
                            ? 'bg-green-100 text-green-800'
                            : entry.status === 'On Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : entry.status === 'Open'
                                ? 'bg-yellow-100 text-yellow-800'
                                : entry.status === 'Canceled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{entry.pic}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex justify-center gap-2">
                        {/* View */}
                        <div className="relative group">
                          <button
                            onClick={() => handleViewDetail(entry)}
                            className="p-1 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <span
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
      whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white
      opacity-0 group-hover:opacity-100 transition pointer-events-none"
                          >
                            Lihat Detail
                          </span>
                        </div>

                        {/* Edit */}
                        <div className="relative group">
                          <button
                            onClick={() => onEdit(entry)}
                            className="p-1 hover:bg-yellow-50 rounded"
                          >
                            <Edit className="w-4 h-4 text-yellow-600" />
                          </button>
                          <span
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
      whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white
      opacity-0 group-hover:opacity-100 transition pointer-events-none"
                          >
                            Edit Data
                          </span>
                        </div>

                        {/* Delete */}
                        <div className="relative group">
                          <button
                            onClick={() => handleDelete(entry.no)}
                            className="p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                          <span
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
      whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white
      opacity-0 group-hover:opacity-100 transition pointer-events-none"
                          >
                            Hapus Data
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      <LogbookDetailDialog
        entry={detailEntry}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
