import { RouteMeta } from "vue-router";
import type { Menu } from "@/api/auth/model/LoginModel";

declare module "vue-router" {
  export interface RouteMeta
    extends Partial<
      Pick<Menu, "menuType" | "icon" | "orderNum" | "keepalive" | "isShow">
    > {
    title?: string;
    notRequireAuth?: boolean;
    fullPath?: string;
    perms?: string[];
  }
}
