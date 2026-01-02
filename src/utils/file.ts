import fs from "fs"
import path from "path"

export const saveEventImage = async (file: Express.Multer.File) => {
  const dir = path.join(process.cwd(), "uploads/events")
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const filename =
    Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)

  const filepath = path.join(dir, filename)
  await fs.promises.writeFile(filepath, file.buffer)

  return filename
}