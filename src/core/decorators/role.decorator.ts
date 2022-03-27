import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from '@core/enums/role.enum';

export const Roles = (...roles: RoleTypes[]) => SetMetadata('roles', roles);
