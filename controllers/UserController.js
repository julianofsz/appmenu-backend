import User from '../models/User.js';
import Argon2 from 'argon2';
import createUserToken from '../helpers/create-token.js';
export default class UserController {
  static async register(req, res) {
    const { name, email, password, confirmpassword } = req.body;
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório' });
      return;
    }
    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório' });
      return;
    }
    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória' });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: 'Confirme a senha' });
      return;
    }
    if (password !== confirmpassword) {
      res.status(422).json({ message: 'Senhas não são iguais' });
      return;
    }
    try {
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(422).json({ message: 'E-mail já cadastrado' });
      }
      const passwordhash = await Argon2.hash(password, {
        type: Argon2.argon2id,
        memoryCost: 2 ** 16,
        parallelism: 1,
      });
      const user = new User({
        name,
        email,
        password: passwordhash,
      });
      try {
        const newUser = await user.save();
        return res
          .status(201)
          .json({ message: 'Usuário inserido com sucesso', newUser });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Problema ao cadastrar o usuário' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Tente mais tarde novamente' });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório' });
      return;
    }
    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória' });
      return;
    }
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(422).json({ message: 'Credenciais inválidas' });
    }
    const checkPassword = await Argon2.verify(userExist.password, password);
    if (!checkPassword) {
      return res.status(422).json({ message: 'Credenciais inválidas' });
    }
    await createUserToken(userExist, req, res);
  }
}
