import mongoose from "mongoose";
import "dotenv/config";

async function main() {
  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    console.error(
      "ERRO: String de conexão com o MongoDB não encontrada no arquivo .env"
    );
    process.exit(1); // Encerra a aplicação se não encontrar a URI
  }
  await mongoose.connect(dbUri);
  console.log("Conectou ao Mongoose!");
}
main().catch((err) => console.log(err));
export default mongoose;
