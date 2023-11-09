import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | any {
    try {
      const requiredRole = this.reflector.get<string>(
        'roles',
        context.getHandler(),
      );
      console.log(requiredRole)
      if (!requiredRole) {
        // No role required, access is granted
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization'];
      console.log(token);
      try {
        const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
  
        console.log(decodedToken)
        // Assuming user roles are stored in the 'roles' property of the token payload
        const userRoles = decodedToken.role;
  
        // Check if the user has the required role
        const hasRole = userRoles===requiredRole[0];
  
        if (!hasRole) {
          console.log(`Access denied. User does not have the required role: ${requiredRole}`);
          return false
        }
  
        return hasRole;
      } catch (error) {
        console.log('Access denied. Invalid token.');
        return false;
      }
      // Check if the user has the required role
      //   return user.roles.includes(requiredRole);
    } catch (e) {
      return {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      };
    }
  }
}
