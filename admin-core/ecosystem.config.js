module.exports = {
  apps: [
    {
      name: "common-admin",
      script: "./dist/main.js", // 执行的文件
      cwd: "./", // 根目录
      args: "", // 传递给脚本的参数
      instances: "1", // max表示最大的 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
      autorestart: true, // 默认为 true, 发生异常的情况下自动重启

      max_memory_restart: "1G",

      error_file: "./logs/app-err.log", // 错误日志文件

      out_file: "./logs/app-out.log", // 正常日志文件

      merge_logs: true, // 设置追加日志而不是新建日志

      time: false, // 禁用日志时间

      min_uptime: "60s", // 应用运行少于时间被认为是异常启动

      max_restarts: 10, // 最大异常重启次数

      restart_delay: 60, // 异常重启情况下，延时重启时间
      env: {
        // 环境参数,当前指定为生产环境
        NODE_ENV: "production",
      },
    },
  ],
};
