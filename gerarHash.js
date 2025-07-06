import argon2 from 'argon2';

async function hashPassword() {
  try {
    // Escolha a senha que você quer usar para o admin
    const password = 'admin_senha_123'; 

    console.log(`Gerando hash para a senha: "${password}"...`);

    // Gera o hash usando as mesmas configurações do seu controller
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      parallelism: 1
    });

    console.log("\n Hash gerado com sucesso!");
    console.log("\nCOPIE O TEXTO ABAIXO (INCLUINDO OS SÍMBOLOS $)");
    console.log(hash);
    console.log("------------------------------------------------------");

  } catch (err) {
    console.error("Erro ao gerar o hash:", err);
  }
}

hashPassword();