import { Migration } from '@mikro-orm/migrations';

export class Migration20221024045736 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `role` (`id` int unsigned not null auto_increment primary key, `create_time` int unsigned not null, `create_by` int null, `update_time` int unsigned null, `update_by` int null, `delete_time` int unsigned null, `is_delete` tinyint(1) not null, `role_name` varchar(100) not null, `remark` varchar(200) null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `admin_user` (`id` int unsigned not null auto_increment primary key, `create_time` int unsigned not null, `create_by` int null, `update_time` int unsigned null, `update_by` int null, `delete_time` int unsigned null, `is_delete` tinyint(1) not null, `user_name` varchar(100) not null, `nick_name` varchar(100) not null, `password` varchar(150) not null, `salt` varchar(10) not null, `remark` varchar(200) null, `role_id` int unsigned not null) default character set utf8mb4 engine = InnoDB comment = \'后台管理员账户表\';');
    this.addSql('alter table `admin_user` add index `admin_user_role_id_index`(`role_id`);');

    this.addSql('create table `sys_menu` (`id` int unsigned not null auto_increment primary key, `create_time` int unsigned not null, `create_by` int null, `update_time` int unsigned null, `update_by` int null, `delete_time` int unsigned null, `is_delete` tinyint(1) not null, `parent_menu_id` int unsigned null, `menu_name` varchar(100) not null, `menu_type` tinyint not null comment \'菜单类型:0目录 1菜单 2权限\', `router` varchar(200) null comment \'客户端路由\', `permissions` varchar(200) null comment \'权限字符串\', `view_path` varchar(200) null comment \'客户端视图路径\', `icon` varchar(100) null, `order_num` int not null, `keepalive` tinyint(1) not null comment \'视图是否缓存\', `is_show` tinyint(1) not null comment \'是否显示\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `sys_menu` add index `sys_menu_parent_menu_id_index`(`parent_menu_id`);');

    this.addSql('create table `role_menus` (`role_id` int unsigned not null, `sys_menu_id` int unsigned not null, primary key (`role_id`, `sys_menu_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `role_menus` add index `role_menus_role_id_index`(`role_id`);');
    this.addSql('alter table `role_menus` add index `role_menus_sys_menu_id_index`(`sys_menu_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `admin_user` drop foreign key `admin_user_role_id_foreign`;');

    this.addSql('alter table `role_menus` drop foreign key `role_menus_role_id_foreign`;');

    this.addSql('alter table `sys_menu` drop foreign key `sys_menu_parent_menu_id_foreign`;');

    this.addSql('alter table `role_menus` drop foreign key `role_menus_sys_menu_id_foreign`;');

    this.addSql('drop table if exists `role`;');

    this.addSql('drop table if exists `admin_user`;');

    this.addSql('drop table if exists `sys_menu`;');

    this.addSql('drop table if exists `role_menus`;');
  }

}
