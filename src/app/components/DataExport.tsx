import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, FileSpreadsheet, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useDataExport, ExportOptions } from '../hooks/useDataExport';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export function DataExport() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { exportData, isExporting } = useDataExport();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: '7d',
    includeCharts: true,
    includeAlerts: true,
  });
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    console.log('Export clicked with options:', exportOptions);
    setExportStatus('idle');
    const success = await exportData(exportOptions);
    console.log('Export success:', success);
    setExportStatus(success ? 'success' : 'error');
    
    // Reset status after 3 seconds
    setTimeout(() => setExportStatus('idle'), 3000);
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Spreadsheet format' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Document format' },
  ];

  const dateRangeOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'all', label: 'All time' },
  ];

  return (
    <div 
      className="rounded-2xl p-6"
      style={{
        background: theme === 'dark' ? '#2d4a1e' : '#ffffff',
        border: `1.5px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.18)' : 'rgba(137, 204, 65, 0.18)'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)',
          }}
        >
          <Download size={20} style={{ color: theme === 'dark' ? '#89CC41' : '#28951B' }} />
        </div>
        <div>
          <h3 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: theme === 'dark' ? '#E6F786' : '#1a3a10',
            }}
          >
            Data Export
          </h3>
          <p 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.8rem',
              color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
            }}
          >
            Export your greenhouse data in various formats
          </p>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: theme === 'dark' ? '#E6F786' : '#1a3a10',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            {formatOptions.map((format) => (
              <motion.button
                key={format.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as 'csv' | 'pdf' }))}
                className="p-4 rounded-xl border-2 transition-all"
                style={{
                  background: exportOptions.format === format.value 
                    ? theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)'
                    : 'transparent',
                  borderColor: exportOptions.format === format.value
                    ? theme === 'dark' ? '#89CC41' : '#28951B'
                    : theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(40, 149, 27, 0.1)',
                }}
              >
                <format.icon 
                  size={24} 
                  style={{ 
                    color: exportOptions.format === format.value 
                      ? theme === 'dark' ? '#89CC41' : '#28951B'
                      : theme === 'dark' ? '#8aab6a' : '#6b8a55'
                  }} 
                />
                <div className="mt-2">
                  <div 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                    }}
                  >
                    {format.label}
                  </div>
                  <div 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.7rem',
                      color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
                    }}
                  >
                    {format.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div>
          <label 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: theme === 'dark' ? '#E6F786' : '#1a3a10',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dateRangeOptions.map((range) => (
              <motion.button
                key={range.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExportOptions(prev => ({ ...prev, dateRange: range.value as any }))}
                className="p-3 rounded-lg border transition-all"
                style={{
                  background: exportOptions.dateRange === range.value 
                    ? theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)'
                    : 'transparent',
                  borderColor: exportOptions.dateRange === range.value
                    ? theme === 'dark' ? '#89CC41' : '#28951B'
                    : theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(40, 149, 27, 0.1)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Calendar 
                    size={16} 
                    style={{ 
                      color: exportOptions.dateRange === range.value 
                        ? theme === 'dark' ? '#89CC41' : '#28951B'
                        : theme === 'dark' ? '#8aab6a' : '#6b8a55'
                    }} 
                  />
                  <span 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                    }}
                  >
                    {range.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Additional Options (PDF only) */}
        {exportOptions.format === 'pdf' && (
          <div>
            <label 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Include in Report
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: theme === 'dark' ? '#89CC41' : '#28951B',
                  }}
                />
                <span 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                    color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                  }}
                >
                  Charts and Graphs
                </span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeAlerts}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeAlerts: e.target.checked }))}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: theme === 'dark' ? '#89CC41' : '#28951B',
                  }}
                />
                <span 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                    color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                  }}
                >
                  Alert History
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Export Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isExporting 
              ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
              : 'linear-gradient(135deg, #28951B, #89CC41)',
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
          }}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download size={18} />
              Export {exportOptions.format.toUpperCase()}
            </>
          )}
        </motion.button>

        {/* Status Messages */}
        <AnimatePresence>
          {exportStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{
                background: theme === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
              }}
            >
              <CheckCircle size={16} style={{ color: '#22c55e' }} />
              <span 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  color: '#22c55e',
                  fontWeight: 500,
                }}
              >
                Export completed successfully!
              </span>
            </motion.div>
          )}

          {exportStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{
                background: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
              }}
            >
              <AlertCircle size={16} style={{ color: '#ef4444' }} />
              <span 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  fontWeight: 500,
                }}
              >
                Export failed. Please try again.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
