import * as XLSX from 'xlsx';

export interface FlatEntry {
  key: string;
  value: string;
}

/**
 * Flatten nested object into dot-notation paths
 */
export function flattenObject(obj: any, prefix: string = ''): FlatEntry[] {
  const result: FlatEntry[] = [];
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result.push(...flattenObject(value, fullKey));
    } else {
      result.push({
        key: fullKey,
        value: String(value)
      });
    }
  }
  
  return result;
}

/**
 * Unflatten dot-notation paths back into nested object
 */
export function unflattenObject(flatData: FlatEntry[]): any {
  const result: any = {};
  
  for (const item of flatData) {
    const keys = item.key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = item.value;
  }
  
  return result;
}

/**
 * Convert TypeScript content to Excel buffer
 */
export function tsToExcel(tsContent: string): Buffer {
  // Remove 'export default' and 'as const'
  let cleanedContent = tsContent
    .replace(/export\s+default\s+/, '')
    .replace(/\s+as\s+const\s*;?\s*$/, '');
  
  // Evaluate the object
  const translationObj = eval(`(${cleanedContent})`);
  
  // Flatten the object
  const flatData = flattenObject(translationObj);
  
  // Create worksheet data with headers
  const worksheetData = [
    ['Key', 'Value'],
    ...flatData.map(item => [item.key, item.value])
  ];
  
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Auto-size columns
  const maxKeyLength = Math.max(...flatData.map(item => item.key.length), 10);
  const maxValueLength = Math.max(...flatData.map(item => item.value.length), 50);
  
  worksheet['!cols'] = [
    { wch: Math.min(maxKeyLength + 2, 60) },
    { wch: Math.min(maxValueLength + 2, 80) }
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Translations');
  
  // Write to buffer
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Convert Excel buffer to TypeScript content
 */
export function excelToTs(excelBuffer: Buffer): string {
  // Read workbook
  const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  if (data.length === 0) {
    throw new Error('Excel file is empty or has no data');
  }
  
  // Extract key-value pairs
  const flatData: FlatEntry[] = data.map((row: any) => ({
    key: row['Key'] || row['key'],
    value: row['Value'] || row['value']
  }));
  
  // Validate data
  if (!flatData[0]?.key || flatData[0]?.value === undefined) {
    throw new Error('Excel file must have "Key" and "Value" columns');
  }
  
  // Unflatten into nested object
  const translationObj = unflattenObject(flatData);
  
  // Convert to TypeScript string
  const tsContent = `export default ${objectToTsString(translationObj)} as const;\n`;
  
  return tsContent;
}

/**
 * Convert object to formatted TypeScript string
 */
function objectToTsString(obj: any, indent: number = 1): string {
  const indentStr = '  '.repeat(indent);
  const prevIndentStr = '  '.repeat(indent - 1);
  
  let result = '{\n';
  const entries = Object.entries(obj);
  
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    const isLast = i === entries.length - 1;
    
    // Handle key formatting
    const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) && !key.includes('-') 
      ? key 
      : `'${key}'`;
    
    if (value && typeof value === 'object') {
      result += `${indentStr}${formattedKey}: ${objectToTsString(value, indent + 1)}`;
    } else {
      const escapedValue = String(value).replace(/'/g, "\\'");
      result += `${indentStr}${formattedKey}: '${escapedValue}'`;
    }
    
    result += isLast ? '\n' : ',\n';
  }
  
  result += `${prevIndentStr}}`;
  return result;
}
