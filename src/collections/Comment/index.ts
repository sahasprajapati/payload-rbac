import { CollectionConfig } from "payload/types";
import { GroupEnum } from "../../enums/group";
import {
  checkUserPermission,
  permissionAccessChecker,
} from "../../access/admins";
import { ActionsEnum } from "../../enums/actions";
import { publicAccess } from "../../access/public";
import { User } from "payload/generated-types";
import { adminAndSelfPermissionAccessChecker } from "./access/adminAndSelf";

const Comments: CollectionConfig = {
  slug: "comments",
  admin: {
    group: GroupEnum.Article,
    useAsTitle: "comment",
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, "comments", ActionsEnum.View);
    },
    defaultColumns: ["article", "comment", "commenter"],
  },

  access: {
    read: publicAccess,
    update: adminAndSelfPermissionAccessChecker("comments", ActionsEnum.Update),
    delete: adminAndSelfPermissionAccessChecker("comments", ActionsEnum.Delete),
    create: permissionAccessChecker("comments", ActionsEnum.Create),
  },

  fields: [
    {
      name: "article",
      type: "relationship",
      relationTo: "articles",
      required: true,
    },
    { type: "text", name: "comment", required: true },
    {
      type: "relationship",
      relationTo: "users",
      name: "commenter",
      admin: {
        position: "sidebar",
        condition: (data) => {
          return !!data.id;
        },
        readOnly: true,
      },
      required: true,

      hooks: {
        beforeChange: [
          ({ req: { user } }) => {
            return user?.id;
          },
        ],
      },
    },
  ],
};

export default Comments;
