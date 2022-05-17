export const getReadableFileSizeString = (fileSizeInBytes: number, si = false, dp = 1) :string =>  {
  const thresh = si ? 1000 : 1024

  if (Math.abs(fileSizeInBytes) < thresh) {
    return fileSizeInBytes + ' B'
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10**dp

  do {
    fileSizeInBytes /= thresh
    ++u
  } while (Math.round(Math.abs(fileSizeInBytes) * r) / r >= thresh && u < units.length - 1)


  return fileSizeInBytes.toFixed(dp) + ' ' + units[u]
}