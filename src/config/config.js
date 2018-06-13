import Env from './env';

// 环境配置-微应用server前缀配置
let REMOTE_HOST = "http://localhost";
let ICP = "京ICP备18010424号-1";

// // 测试环境
// if (Env === "test") {
//     REMOTE_HOST = "http://172.17.13.74";
// }

// // 开发环境
// if (Env === "develop") {
//     REMOTE_HOST = "http://172.17.13.80";
// }

// // 生产环境
// if (Env === "production") {
//     REMOTE_HOST = "http://172.17.13.74";
// }


let config = {
    env: Env,
    remote_host: REMOTE_HOST,
    icp: ICP
};

export default config;
