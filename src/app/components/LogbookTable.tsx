import { useState, useMemo } from 'react';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LogbookEntry } from '../App';
import { LogbookDetailDialog } from './LogbookDetail';
import Swal from 'sweetalert2';
interface LogbookTableProps {
  entries: LogbookEntry[];
  onEdit: (entry: LogbookEntry) => void;
  onDelete: (no: number) => void;
}

export function LogbookTable({ entries, onEdit, onDelete }: LogbookTableProps) {
  const [detailEntry, setDetailEntry] = useState<LogbookEntry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Bisa diubah sesuai kebutuhan

  // Sort entries by date (newest first)
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const dateA = new Date(a.tanggal).getTime();
      const dateB = new Date(b.tanggal).getTime();
      return dateB - dateA; // Descending order (terbaru dulu)
    });
  }, [entries]);

  const handleViewDetail = (entry: LogbookEntry) => {
    setDetailEntry(entry);
    setIsDetailOpen(true);
  };

  const handleDelete = (no: number) => {
    Swal.fire({
      title: 'Yakin ingin menghapus entry ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(no);
      }
    });
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Reset to page 1 when entries change
  useState(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  });

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
              {currentEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                currentEntries.map((entry) => (
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

        {/* Pagination */}
        {sortedEntries.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              {/* Info */}
              <div className="text-sm text-gray-700">
                Menampilkan{' '}
                <span className="font-medium">{indexOfFirstItem + 1}</span>{' '}
                sampai{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, sortedEntries.length)}
                </span>{' '}
                dari <span className="font-medium">{sortedEntries.length}</span>{' '}
                data
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (typeof pageNum === 'number') {
                          handlePageChange(pageNum);
                        }
                      }}
                      disabled={pageNum === '...'}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white font-medium'
                          : pageNum === '...'
                            ? 'text-gray-400 cursor-default'
                            : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
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
