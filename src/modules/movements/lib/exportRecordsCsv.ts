import type { MovementRecord } from '../models/movement.models'

export function exportRecordsCsv(records: MovementRecord[]) {
  const rows = [
    ['tipo', 'fecha', 'detalle', 'metodo_pago', 'importe_soles', 'nota'],
    ...records.map((record) => [
      record.type,
      record.date,
      record.detail,
      record.payment,
      record.amount.toFixed(2),
      record.note || '',
    ]),
  ]
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','),
    )
    .join('\r\n')
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'autocontrol-registros.csv'
  link.click()
  URL.revokeObjectURL(url)
}
