import { CollectionConfig } from "payload/types";
import { GroupEnum } from "../../enums/group";
import {
  checkUserPermission,
  permissionAccessChecker,
} from "../../access/admins";
import { ActionsEnum } from "../../enums/actions";
import { publicAccess } from "../../access/public";
import { adminAndSelfPermissionAccessChecker } from "./access/adminAndSelf";

const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    group: GroupEnum.Article,
    useAsTitle: "title",
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, "articles", ActionsEnum.View);
    },
    defaultColumns: ["title", "slug", "author"],
  },
  access: {
    read: publicAccess,
    update: adminAndSelfPermissionAccessChecker("articles", ActionsEnum.Update),
    delete: adminAndSelfPermissionAccessChecker("articles", ActionsEnum.Delete),
    create: permissionAccessChecker("articles", ActionsEnum.Create),
  },
  fields: [
    { type: "text", name: "title", required: true },
    { type: "text", name: "slug", required: true, unique: true },
    { type: "text", name: "description", required: true },

    {
      type: "relationship",
      relationTo: "users",
      name: "author",
      required: true,

      admin: {
        readOnly: true,
        position: "sidebar",
        condition: (data) => {
          return !!data.id;
        },
      },
      hooks: {
        beforeChange: [
          ({ req: { user }, data, operation }) => {
            // Assign self to author if not exist
            if (operation === "create") return user?.id;
            return data.author;
          },
        ],
      },
    },
  ],
};

export default Articles;
