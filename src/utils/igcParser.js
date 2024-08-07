import { parse } from 'igc-parser'

export const parseIgcFile = (igcFileContent) => {
  // console.log('igcFileContent', igcFileContent)
  try {
    let flightData
    try {
      flightData = parse(igcFileContent)
    } catch (parseError) {
      console.log(
        'Initial parse failed, attempting to reformat and parse again'
      )
      const reformattedContent = reformatIgcContent(igcFileContent)
      // console.log('Reformatted IGC Content:', reformattedContent)
      flightData = parse(reformattedContent)
      // console.log('Parsed Reformatted IGC Data:', flightData)
    }

    if (!flightData) {
      throw new Error('Failed to parse IGC file')
    }

    return flightData
  } catch (error) {
    console.error('Error parsing IGC file:', error)
    return null
  }
}

function reformatIgcContent(content) {
  const lines = content.split('\n')
  const reformattedLines = lines.map((line) => {
    if (line.startsWith('HFDTEDATE:')) {
      return line.replace('HFDTEDATE:', 'HFDTE')
    }
    if (line.startsWith('HSCCLCOMPETITION CLASS:')) {
      return line.replace('HSCCLCOMPETITION CLASS:', 'HFCCLCOMPETITIONCLASS:')
    }
    return line
  })

  return reformattedLines.join('\n')
}
