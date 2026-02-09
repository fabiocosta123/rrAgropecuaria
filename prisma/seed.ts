import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10)
  
  // Alterado de .user para .usuario
  await prisma.usuario.upsert({
    where: { email: 'contato@rragro.com.br' }, // No seu schema, o email é o campo @unique
    update: {},
    create: {
      username: 'RR AGRO Admin',        
      email: 'contato@rragro.com.br',
      password: hashedPassword,         
    },
  })

  console.log("✅ Usuário padrão rragro criado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })