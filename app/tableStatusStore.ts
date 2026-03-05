
export type TableStatus = {
  section: string
  tableNo: string
  orderId: string
  startTime: number
}

let tables: TableStatus[] = []

export const getTables = () => tables

export const setTableHold = (
  section: string,
  tableNo: string,
  orderId: string
) => {

  const existing = tables.find(
    t => t.section === section && t.tableNo === tableNo
  )

  if (existing) {
    existing.orderId = orderId
    existing.startTime = Date.now()
  } else {
    tables.push({
      section,
      tableNo,
      orderId,
      startTime: Date.now()
    })
  }

}

export const clearTable = (
  section: string,
  tableNo: string
) => {

  tables = tables.filter(
    t => !(t.section === section && t.tableNo === tableNo)
  )

}
