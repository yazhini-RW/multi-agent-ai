'use client'
import { useState } from 'react'
import { uploadPDF, uploadCSV } from '@/lib/api'
import { Upload, FileText, Database, CheckCircle, AlertCircle } from 'lucide-react'

export default function UploadPanel() {
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [csvStatus, setCsvStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [pdfMessage, setPdfMessage] = useState('')
  const [csvMessage, setCsvMessage] = useState('')

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfStatus('loading')
    try {
      const data = await uploadPDF(file)
      setPdfMessage(data.message)
      setPdfStatus('success')
    } catch {
      setPdfMessage('Upload failed. Try again.')
      setPdfStatus('error')
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvStatus('loading')
    try {
      const data = await uploadCSV(file)
      setCsvMessage(data.message)
      setCsvStatus('success')
    } catch {
      setCsvMessage('Upload failed. Try again.')
      setCsvStatus('error')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2">Upload Files</h2>
      <p className="text-gray-400 mb-8">Upload PDFs for the Document Agent or CSVs for the Analyst Agent</p>

      <div className="space-y-6">
        {/* PDF Upload */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-blue-400" />
            <div>
              <h3 className="text-white font-semibold">PDF Document</h3>
              <p className="text-gray-400 text-sm">Upload a PDF to ask questions about it</p>
            </div>
          </div>
          <label className="block">
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <Upload size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-400 text-sm">Click to upload PDF</p>
            </div>
            <input type="file" accept=".pdf" onChange={handlePDFUpload} className="hidden" />
          </label>
          {pdfStatus === 'loading' && (
            <p className="mt-3 text-blue-400 text-sm">Uploading and indexing...</p>
          )}
          {pdfStatus === 'success' && (
            <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              <span>{pdfMessage}</span>
            </div>
          )}
          {pdfStatus === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{pdfMessage}</span>
            </div>
          )}
        </div>

        {/* CSV Upload */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={24} className="text-green-400" />
            <div>
              <h3 className="text-white font-semibold">CSV Data File</h3>
              <p className="text-gray-400 text-sm">Upload a CSV for data analysis</p>
            </div>
          </div>
          <label className="block">
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors">
              <Upload size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-400 text-sm">Click to upload CSV</p>
            </div>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>
          {csvStatus === 'loading' && (
            <p className="mt-3 text-blue-400 text-sm">Uploading...</p>
          )}
          {csvStatus === 'success' && (
            <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              <span>{csvMessage}</span>
            </div>
          )}
          {csvStatus === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{csvMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}