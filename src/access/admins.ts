import type { Access } from "payload/config";
import { Role, Config, User } from "payload/generated-types";
import { ActionsEnum } from "../enums/actions";

export const permissionAccessChecker: (
  subject: keyof Config["collections"],
  action: ActionsEnum
) => Access =
  (subject, action) =>
  ({ req: { user } }) => {
    return checkUserPermission(user, subject, action);
  };

export const checkUserPermission = (
  user: User = undefined,
  subject: keyof Config["collections"],
  action: ActionsEnum
): boolean => {
  if (user) {
    if (
      user?.roles?.some((role: Role) => {
        return role.permissions?.some((permission) => {
          return (
            permission?.subject === subject &&
            permission?.actions?.includes(action)
          );
        });
      })
    )
      return true;
  }

  return false;
};
