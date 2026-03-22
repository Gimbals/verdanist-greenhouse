import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { useGreenhouse } from '../context/GreenhouseContext';

export interface ExportOptions {
  format: 'csv' | 'pdf';
  dateRange: '24h' | '7d' | '30d' | 'all';
  includeCharts: boolean;
  includeAlerts: boolean;
}

export interface ExportData {
  sensorData: Array<{
    timestamp: string;
    indoorHumidity: number;
    indoorTemperature: number;
    soilMoisture: number;
    waterTankLevel: number;
    signalStrength: number;
  }>;
  alerts: Array<{
    timestamp: string;
    type: string;
    message: string;
    severity: string;
    acknowledged: boolean;
  }>;
  controlHistory: Array<{
    timestamp: string;
    device: string;
    action: string;
    value: any;
  }>;
}

export const useDataExport = () => {
  const { sensorData, alerts, humidityHistory, soilHistory, temperatureHistory } = useGreenhouse();
  const [isExporting, setIsExporting] = useState(false);

  const generateMockData = (dateRange: string): ExportData => {
    const now = new Date();
    let dataPoints = 24; // Default 24 hours
    
    switch (dateRange) {
      case '7d':
        dataPoints = 7 * 24;
        break;
      case '30d':
        dataPoints = 30 * 24;
        break;
      case 'all':
        dataPoints = 365 * 24;
        break;
    }

    const sensorDataArray = Array.from({ length: dataPoints }, (_, i) => {
      const timestamp = new Date(now.getTime() - (dataPoints - i) * 60 * 60 * 1000);
      return {
        timestamp: timestamp.toISOString(),
        indoorHumidity: 72 + (Math.random() - 0.5) * 15,
        indoorTemperature: 28.4 + (Math.random() - 0.5) * 8,
        soilMoisture: 45 + (Math.random() - 0.5) * 20,
        waterTankLevel: Math.max(10, 68 - i * 0.3 + (Math.random() - 0.5) * 5),
        signalStrength: 87 + (Math.random() - 0.5) * 10,
      };
    });

    const alertsArray = [
      {
        timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        type: 'Soil Moisture',
        message: 'Outdoor polybag area soil moisture critically low (28%)',
        severity: 'critical',
        acknowledged: false,
      },
      {
        timestamp: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
        type: 'High Humidity',
        message: 'Indoor misting room humidity exceeded threshold (88%)',
        severity: 'warning',
        acknowledged: false,
      },
      {
        timestamp: new Date(now.getTime() - 32 * 60 * 1000).toISOString(),
        type: 'Network',
        message: 'Brief network disconnection detected - auto-reconnected',
        severity: 'info',
        acknowledged: true,
      },
    ];

    const controlHistoryArray = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (10 - i) * 60 * 60 * 1000).toISOString(),
      device: Math.random() > 0.5 ? 'indoor-pump' : 'outdoor-pump',
      action: Math.random() > 0.5 ? 'toggle' : 'schedule',
      value: Math.random() > 0.5,
    }));

    return {
      sensorData: sensorDataArray,
      alerts: alertsArray,
      controlHistory: controlHistoryArray,
    };
  };

  const exportToCSV = async (data: ExportData, filename: string) => {
    try {
      setIsExporting(true);

      // Prepare CSV data
      const csvData = [
        // Sensor data headers
        ['Timestamp', 'Indoor Humidity (%)', 'Indoor Temperature (°C)', 'Soil Moisture (%)', 'Water Tank Level (%)', 'Signal Strength (%)'],
        // Sensor data rows
        ...data.sensorData.map(row => [
          new Date(row.timestamp).toLocaleString(),
          row.indoorHumidity.toFixed(1),
          row.indoorTemperature.toFixed(1),
          row.soilMoisture.toFixed(1),
          row.waterTankLevel.toFixed(1),
          row.signalStrength.toFixed(1),
        ]),
        // Empty row
        [],
        // Alerts headers
        ['Alert Timestamp', 'Type', 'Message', 'Severity', 'Acknowledged'],
        // Alerts rows
        ...data.alerts.map(alert => [
          new Date(alert.timestamp).toLocaleString(),
          alert.type,
          alert.message,
          alert.severity,
          alert.acknowledged ? 'Yes' : 'No',
        ]),
        // Empty row
        [],
        // Control history headers
        ['Control Timestamp', 'Device', 'Action', 'Value'],
        // Control history rows
        ...data.controlHistory.map(control => [
          new Date(control.timestamp).toLocaleString(),
          control.device,
          control.action,
          typeof control.value === 'boolean' ? (control.value ? 'ON' : 'OFF') : control.value,
        ]),
      ];

      // Convert to CSV string
      const csvString = Papa.unparse(csvData);

      // Create and download file
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('CSV file downloaded:', filename);
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async (elementId: string, filename: string, includeCharts: boolean = true) => {
    try {
      setIsExporting(true);

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found for PDF export');
      }

      // Configure html2canvas options
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(filename);
      console.log('PDF file downloaded:', filename);

      return true;
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const exportData = async (options: ExportOptions) => {
    const data = generateMockData(options.dateRange);
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (options.format === 'csv') {
      const filename = `verdanist-data-${options.dateRange}-${timestamp}.csv`;
      return await exportToCSV(data, filename);
    } else if (options.format === 'pdf') {
      const filename = `verdanist-report-${options.dateRange}-${timestamp}.pdf`;
      
      if (options.includeCharts) {
        return await exportToPDF('export-content', filename, true);
      } else {
        // Create a simple text-based PDF without charts
        const pdf = new jsPDF();
        
        // Add title
        pdf.setFontSize(20);
        pdf.text('Verdanist IoT Greenhouse Report', 20, 20);
        
        // Add date range
        pdf.setFontSize(12);
        pdf.text(`Date Range: ${options.dateRange}`, 20, 30);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);
        
        // Add summary statistics
        pdf.setFontSize(14);
        pdf.text('Summary Statistics', 20, 60);
        
        pdf.setFontSize(10);
        const avgHumidity = data.sensorData.reduce((sum, d) => sum + d.indoorHumidity, 0) / data.sensorData.length;
        const avgTemp = data.sensorData.reduce((sum, d) => sum + d.indoorTemperature, 0) / data.sensorData.length;
        const avgSoilMoisture = data.sensorData.reduce((sum, d) => sum + d.soilMoisture, 0) / data.sensorData.length;
        
        pdf.text(`Average Humidity: ${avgHumidity.toFixed(1)}%`, 20, 70);
        pdf.text(`Average Temperature: ${avgTemp.toFixed(1)}°C`, 20, 80);
        pdf.text(`Average Soil Moisture: ${avgSoilMoisture.toFixed(1)}%`, 20, 90);
        
        // Add alerts summary
        if (options.includeAlerts) {
          pdf.setFontSize(14);
          pdf.text('Recent Alerts', 20, 110);
          
          pdf.setFontSize(10);
          data.alerts.slice(0, 5).forEach((alert, index) => {
            const y = 120 + (index * 10);
            pdf.text(`${alert.severity.toUpperCase()}: ${alert.message}`, 20, y);
          });
        }
        
        pdf.save(filename);
        return true;
      }
    }
    
    return false;
  };

  return {
    exportData,
    exportToCSV,
    exportToPDF,
    isExporting,
  };
};
