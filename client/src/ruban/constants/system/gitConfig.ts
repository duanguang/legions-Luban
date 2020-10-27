/**
 * git仓库列表
 */
export const WAREHOUSE_LIST = [{
    key: '002',
    value: 'hoolinks-scm-web',
},{
    key: '001',
    value: 'hoolins-system-web',
}]
/**
 *  仓库功能模块列表
 */
export const FEATURE_MODULES = [
    {
        warehouseKey: '001',
        key: '001011',
        value:'4pl(运营后台)',
        keyValue:'4pl',
    },
    {
        warehouseKey: '001',
        key: '001012',
        value:'cpc(预归类)',
        keyValue:'cpc',
    },
    {
        warehouseKey: '001',
        key: '001013',
        value:'dms(简易对账)',
        keyValue:'dms',
    },
    {
        warehouseKey: '001',
        key: '001014',
        value:'jat-customs(境岸通)',
        keyValue:'jat-customs',
    },
    {
        warehouseKey: '001',
        key: '001015',
        value:'lcm(云枢纽)',
        keyValue:'lcm',
    },
    {
        warehouseKey: '001',
        key: '001016',
        value:'lcm-ground-service(地勤服务)',
        keyValue:'lcm-ground-service',
    },
    {
        warehouseKey: '001',
        key: '001017',
        value:'lcm-manifest(公路舱单)',
        keyValue:'lcm-manifest',
    },
    {
        warehouseKey: '001',
        key: '001018',
        value:'lcm-shipping-manifest(海运舱单)',
        keyValue:'lcm-shipping-manifest',
    },
    {
        warehouseKey: '001',
        key: '001019',
        keyValue:'lcm-warehousing',
        value:'lcm-warehousing(仓储服务)',
    },
    {
        warehouseKey: '002',
        key: '002002',
        keyValue:'scm',
        value:'scm(金关手册)',
    },
    {
        warehouseKey: '002',
        key: '002003',
        keyValue:'customBusiness-synergy',
        value:'customBusiness-synergy(原始计划单)',
    },
    {
        warehouseKey: '002',
        key: '002004',
        value:'scm-findRemit(寻汇)',
        keyValue:'scm-findRemit',
    },
    {
        warehouseKey: '002',
        key: '002005',
        value:'scm-shippingOrder(出货管理)',
        keyValue:'scm-shippingOrder',
    },
    {
        warehouseKey: '002',
        key: '002006',
        value:'scp-checkList(SCP核注清单)',
        keyValue:'scp-checkList',
    },
]
/**
 * git 仓库地址 // https://gogs.hoolinks.com/Front-End-Project/
 * http://user:pwd@192.168.200.99:3000
 */
export const GIT_URL = 'https://user:pwd@gogs.hoolinks.com/Front-End-Project/modules.git' 
