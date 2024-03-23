import { Access } from "payload/config";
import { Config } from "payload/generated-types";
import { ActionsEnum } from "../../../enums/actions";
import { checkUserPermission } from "../../../access/admins";

export const adminAndSelfPermissionAccessChecker: (
  subject: keyof Config["collections"],
  action: ActionsEnum
) => Access =
  (subject, action) =>
  ({ req: { user } }) => {
    if (checkUserPermission(user, subject, action)) {
      return {
        author: {
          equals: user?.id,
        },
      };
    }
    return false;
  };
