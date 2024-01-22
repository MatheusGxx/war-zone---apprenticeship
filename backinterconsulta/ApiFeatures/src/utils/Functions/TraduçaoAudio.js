import OpenIA from 'openai'
import fs from 'fs'

const apiKey = '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'

const openia = new OpenIA({ apiKey })

export const TraduçaoAudioParaTextoIA = async (filePath) => {
    const transcription = await openia.audio.transcriptions.create({
        file:  fs.createReadStream(`${filePath}`),
        model: "whisper-1",
        language: 'pt'
    })

    return transcription.text
}


