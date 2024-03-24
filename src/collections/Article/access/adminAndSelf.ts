import { Access } from "payload/config";
import { Config } from "payload/generated-types";
import { ActionsEnum } from "../../../enums/actions";
import { checkIsAdmin, checkUserPermission } from "../../../access/admins";

export const adminAndSelfPermissionAccessChecker: (
  subject: keyof Config["collections"],
  action: ActionsEnum
) => Access =
  (subject, action) =>
  ({ req: { user } }) => {
    if (checkUserPermission(user, subject, action)) {
      // Only if admin has permission give access, Otherwise only give access to the article author
      if (checkIsAdmin(user)) {
        return true;
      }
      return {
        author: {
          equals: user?.id,
        },
      };
    }
    return false;
  };
