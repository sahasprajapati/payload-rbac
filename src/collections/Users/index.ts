import { CollectionConfig } from "payload/types";
import { GroupEnum } from "../../enums/group";
import {
  checkUserPermission,
  permissionAccessChecker,
} from "../../access/admins";
import { ActionsEnum } from "../../enums/actions";
import { publicAccess } from "../../access/public";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,

  admin: {
    group: GroupEnum.System,
    useAsTitle: "email",
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, "users", ActionsEnum.View);
    },
    defaultColumns: ["name", "roles"],
  },
  access: {
    read: publicAccess,
    update: permissionAccessChecker("users", ActionsEnum.Update),
    delete: permissionAccessChecker("users", ActionsEnum.Delete),
    create: permissionAccessChecker("users", ActionsEnum.Create),
  },
  fields: [
    { type: "text", name: "name", required: true },

    { type: "relationship", name: "roles", relationTo: "roles", hasMany: true },

    // Email added by default
    // Add more fields as needed
  ],
};

export default Users;
