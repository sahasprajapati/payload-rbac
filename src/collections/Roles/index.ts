import { CollectionConfig } from "payload/types";
import Articles from "../Article";
import Comments from "../Comment";
import { capitalize } from "../../utilities/capitalize";
import { GroupEnum } from "../../enums/group";
import Users from "../Users";
import {
  checkUserPermission,
  permissionAccessChecker,
} from "../../access/admins";
import { ActionsEnum } from "../../enums/actions";
import { publicAccess } from "../../access/public";

const Roles: CollectionConfig = {
  slug: "roles",
  admin: {
    group: GroupEnum.System,
    useAsTitle: "name",
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, "roles", ActionsEnum.View);
    },
    defaultColumns: ["name", "permissions"],
  },
  access: {
    read: publicAccess,
    update: permissionAccessChecker("roles", ActionsEnum.Update),
    delete: permissionAccessChecker("roles", ActionsEnum.Delete),
    create: permissionAccessChecker("roles", ActionsEnum.Create),
  },
  fields: [
    { type: "text", name: "name", unique: true, required: true },

    {
      type: "array",
      name: "permissions",
      admin: {
        components: {
          RowLabel: ({ data, index }: any) => {
            return data?.subject
              ? capitalize(data?.subject ?? "") + " Permission"
              : `Subject ${index}`;
          },
        },
      },
      fields: [
        {
          type: "select",
          name: "subject",
          options: [
            {
              label: "Articles",
              value: Articles.slug,
            },
            {
              label: "Comments",
              value: Comments.slug,
            },
            {
              label: "Users",
              value: Users.slug,
            },
            {
              label: "Roles",
              value: "roles",
            },
          ],
        },
        {
          type: "select",
          name: "actions",
          hasMany: true,
          options: [
            { label: "Create", value: ActionsEnum.Create },
            { label: "Update", value: ActionsEnum.Update },
            { label: "View", value: ActionsEnum.View },
            { label: "Delete", value: ActionsEnum.Delete },
          ],
        },
      ],
    },
  ],
};

export default Roles;
