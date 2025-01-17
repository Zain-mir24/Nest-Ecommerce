import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { userDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Exception } from 'handlebars';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async signUp(userData: CreateUserDto) {
    try {
      const accessToken = jwt.sign(
        { user_email: userData.email, role: userData.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
      );

      const refreshToken = jwt.sign(
        { user_email: userData.email, role: userData.role },
        process.env.SECRET_REFRESH_KEY,
        { expiresIn: '17h' },
      );



      await this.usersService.create(userData);

      await this.mailerService
        .sendMail({
          to: userData.email, // list of receivers
          from: 'zainnaeemk10@gmail.com', // sender address
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: `Yelo apna token{accessToken}`, // plaintext body
          html: `<a href="http://localhost:4200/signup-verify/${accessToken}/${refreshToken}">Click here to verify your account</a>`,  // HTML body content
        })
        .then((r) => {
          console.log(r, 'SEND RESPONSE');
        })
        .catch((e) => {
          console.log(e, 'ERRRORR');
        });
      return {
        Message: 'Check email to verify your signup',
      };
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }

  async verify(token: string) {
    try {
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      if (verify) {
        const email = verify.user_email;
        let userData = await this.usersService.findByEmail(email);
        userData.verified = true;
        const update = await this.usersService.update(userData.id, userData);
        if(!update){
          throw new Error("Error updating data")
        }
        return {
          message:"User Verified"
        };
      } else {
        throw new Exception( 'Token expireed')
      }
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e,
      }, HttpStatus.BAD_REQUEST, {
        cause: e
      });;
    }
  }

  async login(userData: userDto) {
    try {
      let user = await this.usersService.findByEmail(userData.email);
      console.log(user,"USER")
      if (user && user.verified) {
        const validate = await bcrypt.compare(userData.password, user.password);
        console.log(validate);
        if (validate) {
          const accessToken = jwt.sign(
            { user_email: userData.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '1d' },
          );
          const refreshToken = jwt.sign(
            { user_email: userData.email, role: user.role },
            process.env.SECRET_REFRESH_KEY,
            { expiresIn: '1d' },
          );
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          await this.usersService.update(user.id, user);

          delete user.password;
          return {
            MESSAGE: 'SUCCESSFULLY LOGGED IN',
            User: user,
          };
        } else {
          throw new Error('INCORRECT CREDENTIAL')
      
        }
      }
      throw new Error('USER NOT FOUND')
    } catch (e) {
      console.log(e.message)
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: e.message
      });;
    }
  }

  async generateRefresh(token) {
    try {
      const verify = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
      if (!verify) {
        return 'Login again:  Refresh token expired';
      }
      const email = verify.user_email;
      let userData = await this.usersService.findByEmail(email);
      const accessToken = jwt.sign(
        { user_email: userData.email, role: userData.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
      );
      userData.accessToken = accessToken;
      await this.usersService.update(userData.id, userData);
      return accessToken;
    } catch (e) {
      return e;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async remove(id: number) {
    return this.usersService.remove(id);
  }
}
