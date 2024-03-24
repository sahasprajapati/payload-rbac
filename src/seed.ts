import { Payload } from "payload";
import Articles from "./collections/Article";
import Comments from "./collections/Comment";
import Roles from "./collections/Roles";
import Users from "./collections/Users";
import { ActionsEnum } from "./enums/actions";
export const seed = async (payload: Payload) => {
  const collections: any[] = [
    Articles.slug,
    Comments.slug,
    Roles.slug,
    Users.slug,
  ];

  const actions = [
    ActionsEnum.Create,
    ActionsEnum.Delete,
    ActionsEnum.Update,
    ActionsEnum.View,
  ];

  const adminRole = await payload.create({
    collection: "roles",
    data: {
      name: "Admin",
      isAdmin: true,
      permissions: collections?.map((collection) => {
        return {
          subject: collection,
          actions: actions,
        };
      }),
    },
  });
  const userRole = await payload.create({
    collection: "roles",
    data: {
      name: "Admin",
      isAdmin: true,
      permissions: ([Articles.slug, Comments.slug] as any)?.map(
        (collection) => {
          return {
            subject: collection,
            actions: actions,
          };
        }
      ),
    },
  });

  const admin = await payload.create({
    collection: "users",
    data: {
      name: "Payload Admin",
      email: "admin@payloadcms.com",
      password: "demo",
      roles: [adminRole.id, userRole.id],
    },
  });

  const user = await payload.create({
    collection: "users",
    data: {
      name: "Payload User",
      email: "user@payloadcms.com",
      password: "demo",
      roles: [userRole.id],
    },
  });
};
