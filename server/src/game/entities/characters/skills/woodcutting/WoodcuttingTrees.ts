// enum TreeTypes {
//     NORMAL,
//     ACHEY,
//     OAK,
//     WILLOW,
//     TEAK,
//     MAPLE,
//     MAHOGANY,
//     YEW,
//     MAGIC
// }

interface WoodcuttingTreeType {
    tree_ids: number[];
    log_id: number;
    stump_id: number;
    level: number;
    exp: number;
    chance: number;
}

interface WoodcuttingTree {
    NORMAL: WoodcuttingTreeType
}

export const WoodcuttingTrees: WoodcuttingTree = {
    NORMAL: {
        tree_ids: [
            1276, 1277, 1278, 1279, 1280, 1282, 1283, 1284, 1285, 1285, 1286, 1289, 1290, 1291, 1315,
            1316, 1318, 1330, 1331, 1332, 1365, 1383, 1384, 2409, 3033, 3034, 3035, 3036, 3881, 3882,
            3883, 5902, 5903, 5904, 10041
        ],
        log_id: 1511,
        stump_id: 1342,
        level: 1,
        exp: 25,
        chance: 100
    }
}