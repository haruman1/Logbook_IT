import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import type { LogbookEntry } from '../App';

interface LogbookDetailDialogProps {
  entry: LogbookEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogbookDetailDialog({
  entry,
  open,
  onOpenChange,
}: LogbookDetailDialogProps) {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Entry No: {entry.no}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tanggal */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">Tanggal:</span>
            <span className="col-span-2">
              {' '}
              {new Date(entry.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Modul/Fitur */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">Modul/Fitur:</span>
            <span className="col-span-2">{entry.modul_fitur}</span>
          </div>

          {/* Aktivitas */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">Aktivitas:</span>
            <span className="col-span-2">{entry.aktivitas}</span>
          </div>

          {/* Detail Teknis */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">Detail Teknis:</span>
            <span className="col-span-2 whitespace-pre-wrap">
              {entry.detail_teknis || '-'}
            </span>
          </div>

          {/* Kendala */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">Kendala:</span>
            <span className="col-span-2 whitespace-pre-wrap">
              {entry.kendala || '-'}
            </span>
          </div>

          {/* Solusi */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">Solusi:</span>
            <span className="col-span-2 whitespace-pre-wrap">
              {entry.solusi || '-'}
            </span>
          </div>

          {/* Status */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">Status:</span>
            <span className="col-span-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  entry.status === 'Done'
                    ? 'bg-green-100 text-green-800'
                    : entry.status === 'On Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : entry.status === 'Open'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {entry.status}
              </span>
            </span>
          </div>

          {/* PIC */}
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold text-gray-700">PIC:</span>
            <span className="col-span-2">{entry.pic}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
