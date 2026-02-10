import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { LogbookEntry } from '../App';

interface LogbookFormProps {
  entry?: LogbookEntry | null;
  onSubmit: (entry: Omit<LogbookEntry, 'no'>) => Promise<void> | void;
  onClose: () => void;
}

/**
 * Helper function to get the current date in the local timezone.
 * The date is returned in the format 'YYYY-MM-DD'.
 * @returns {string} The current date in the local timezone.
 */
const getLocalDate = (): string => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  /**
   * The toISOString() method returns a string with the date portion of the
   * timestamp in the format 'YYYY-MM-DDTHH:M:S.sssZ'.
   * We slice the string to get the date portion only.
   */
  return local.toISOString().slice(0, 10);
};

export function LogbookForm({ entry, onSubmit, onClose }: LogbookFormProps) {
  const [formData, setFormData] = useState({
    tanggal:
      entry?.tanggal instanceof Date
        ? entry.tanggal.toISOString().slice(0, 10)
        : entry?.tanggal || getLocalDate(),
    modul_fitur: entry?.modul_fitur || '',
    aktivitas: entry?.aktivitas || '',
    detail_teknis: entry?.detail_teknis || '',
    kendala: entry?.kendala || '',
    solusi: entry?.solusi || '',
    status: entry?.status || '', // ✅ Perhatikan ini
    pic: entry?.pic || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tanggal) newErrors.tanggal = 'Tanggal harus diisi';
    if (!formData.modul_fitur.trim())
      newErrors.modul_fitur = 'Modul/Fitur harus diisi';
    if (!formData.aktivitas.trim())
      newErrors.aktivitas = 'Aktivitas harus diisi';
    if (!formData.pic.trim()) newErrors.pic = 'PIC harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    console.log('Submitting form data:', formData);
    try {
      await onSubmit({
        ...formData,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal pakai ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">
            {entry ? 'Edit Entry Logbook' : 'Tambah Entry Logbook'}
          </h2>
          <button
            title="Tutup"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tanggal */}
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              title="Masukkan tanggal"
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              max={getLocalDate()} // ✅ Tambahkan ini - batas maksimal hari ini
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.tanggal ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tanggal && (
              <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>
            )}
          </div>

          {/* Modul/Fitur */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Modul / Fitur <span className="text-red-500">*</span>
            </label>
            <input
              title="Modul / Fitur yang diperbaiki"
              type="text"
              name="modul_fitur"
              value={formData.modul_fitur}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.modul_fitur ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.modul_fitur && (
              <p className="text-red-500 text-sm mt-1">{errors.modul_fitur}</p>
            )}
          </div>

          {/* Aktivitas */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Aktivitas <span className="text-red-500">*</span>
            </label>
            <input
              title="Aktivitas yang dilakukan"
              type="text"
              name="aktivitas"
              value={formData.aktivitas}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.aktivitas ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.aktivitas && (
              <p className="text-red-500 text-sm mt-1">{errors.aktivitas}</p>
            )}
          </div>

          {/* Detail Teknis */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Detail Teknis
            </label>
            <textarea
              title="Detail teknis yang dilakukan"
              name="detail_teknis"
              value={formData.detail_teknis}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Kendala */}
          <div>
            <label className="block text-sm font-medium mb-1">Kendala</label>
            <textarea
              title="Kendala yang di alami"
              name="kendala"
              value={formData.kendala}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Solusi */}
          <div>
            <label className="block text-sm font-medium mb-1">Solusi</label>
            <textarea
              title="Solusi yang dilakukan"
              name="solusi"
              value={formData.solusi}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Status - ✅ PERBAIKAN UTAMA */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              title="Status pengerjaan" // ✅ Fix: title yang benar
              name="status" // ✅ Fix: name="status"
              value={formData.status} // ✅ Fix: formData.status
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">-- Pilih Status --</option>
              <option value="open">Open</option>
              <option value="on progress">On Progress</option>
              <option value="done">Done</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* PIC */}
          <div>
            <label className="block text-sm font-medium mb-1">
              PIC <span className="text-red-500">*</span>
            </label>
            <input
              title="Penanggung jawab"
              type="text"
              name="pic"
              value={formData.pic}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.pic ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pic && (
              <p className="text-red-500 text-sm mt-1">{errors.pic}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
